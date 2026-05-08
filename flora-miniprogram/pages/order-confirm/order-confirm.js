// pages/order-confirm/order-confirm.js
const app = getApp(;

Page({
  data: {
    address: null,
    goodsList: [],
    selectedCoupon: null,
    remark: '',
    totalPrice: '0.00',
    orderId: ''
  },

  onLoad(options) {
    if (options.orderId) {
      this.setData({ orderId: options.orderId });
      this.loadOrderData(options.orderId);
    } else {
      this.loadCartData();
    }
    this.loadDefaultAddress();
  },

  onShow() {
    // 从地址选择页返回时刷新
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage.data.fromAddressSelect) {
      this.loadDefaultAddress();
    }
  },

  loadCartData() {
    // 从购物车加载商品
    const cart = wx.getStorageSync('checkoutItems') || [];
    this.setData({ goodsList: cart });
    this.calculateTotal();
  },

  loadOrderData(orderId) {
    // 从订单加载商品（重新支付场景）
    wx.request({
      url: app.globalData.baseUrl + '/order/detail/' + orderId,
      header: { 'Authorization': 'Bearer ' + wx.getStorageSync('token') },
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({ goodsList: res.data.data.goods });
          this.calculateTotal();
        }
      }
    });
  },

  loadDefaultAddress() {
    wx.request({
      url: app.globalData.baseUrl + '/user/address',
      header: { 'Authorization': 'Bearer ' + wx.getStorageSync('token') },
      success: (res) => {
        if (res.data.code === 200 && res.data.data.length > 0) {
          const defaultAddr = res.data.data.find(addr => addr.is_default) || res.data.data[0];
          this.setData({ address: defaultAddr });
        }
      }
    });
  },

  selectAddress() {
    wx.navigateTo({ url: '/pages/address/address?select=true' });
  },

  selectCoupon() {
    wx.navigateTo({ url: '/pages/coupon/coupon?select=true' });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  calculateTotal() {
    const total = this.data.goodsList.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);
    
    // 减去优惠券金额
    if (this.data.selectedCoupon) {
      total -= parseFloat(this.data.selectedCoupon.amount);
    }
    
    this.setData({ totalPrice: total.toFixed(2) });
  },

  submitOrder() {
    if (!this.data.address) {
      wx.showToast({ title: '请选择收货地址', icon: 'none' });
      return;
    }

    const orderData = {
      goodsList: this.data.goodsList,
      addressId: this.data.address.id,
      remark: this.data.remark,
      couponId: this.data.selectedCoupon ? this.data.selectedCoupon.id : null
    };

    wx.request({
      url: app.globalData.baseUrl + '/order/create',
      method: 'POST',
      header: { 'Authorization': 'Bearer ' + wx.getStorageSync('token') },
      data: orderData,
      success: (res) => {
        if (res.data.code === 200) {
          // 清空购物车
          wx.removeStorageSync('cart');
          // 发起支付
          this.requestPayment(res.data.orderId, res.data.orderNo);
        } else {
          wx.showToast({ title: res.data.message, icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  requestPayment(orderId, orderNo) {
    wx.request({
      url: app.globalData.baseUrl + '/pay/unifiedOrder',
      method: 'POST',
      header: { 'Authorization': 'Bearer ' + wx.getStorageSync('token') },
      data: { orderId },
      success: (res) => {
        if (res.data.code === 200) {
          const payParams = res.data.data;
          wx.requestPayment({
            timeStamp: payParams.timeStamp,
            nonceStr: payParams.nonceStr,
            package: payParams.package,
            signType: payParams.signType,
            paySign: payParams.paySign,
            success: () => {
              wx.showToast({ title: '支付成功', icon: 'success' });
              wx.redirectTo({ url: '/pages/order/order?status=paid' });
            },
            fail: (err) => {
              if (err.errMsg.includes('cancel')) {
                wx.showToast({ title: '支付取消', icon: 'none' });
                wx.redirectTo({ url: '/pages/order/order?status=pending' });
              } else {
                wx.showToast({ title: '支付失败', icon: 'none' });
              }
            }
          });
        }
      }
    });
  }
});
