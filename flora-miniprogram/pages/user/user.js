// pages/user/user.js - 个人中心页（用户数据由后台API控制）
const app = getApp();
const api = require('../../utils/api.js').default;

Page({
  data: {
    isLogin: false,
    userInfo: {},
    orderCounts: { pending: 0, paid: 0, shipped: 0 },
    couponCount: 0,
    points: 0
  },

  onShow() {
    this.checkLogin();
    if (this.data.isLogin) {
      this.loadUserData();
    }
  },

  checkLogin() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.setData({
        isLogin: true,
        userInfo: wx.getStorageSync('userInfo') || {}
      });
    }
  },

  onLogin() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo);
        this.setData({
          isLogin: true,
          userInfo: res.userInfo
        });
        this.wxLogin();
      }
    });
  },

  wxLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 发送code到后端换取openid和session_key
          wx.request({
            url: app.globalData.baseUrl + '/auth/login',
            method: 'POST',
            data: { code: res.code },
            success: (res) => {
              wx.setStorageSync('token', res.data.token);
              app.globalData.isLogin = true;
              app.globalData.token = res.data.token;
              this.loadUserData();
            }
          });
        }
      }
    });
  },

  // 加载用户数据（由API控制）
  loadUserData() {
    Promise.all([
      api.getUserInfo(),
      api.getCoupons()
    ]).then(([userRes, couponRes]) => {
      this.setData({
        userInfo: userRes.userInfo || {},
        orderCounts: userRes.orderCounts || { pending: 0, paid: 0, shipped: 0 },
        couponCount: couponRes.coupons?.length || 0,
        points: userRes.points || 0
      });
    }).catch(() => {
      // API失败时使用默认值
      this.setData({
        orderCounts: { pending: 0, paid: 0, shipped: 0 },
        couponCount: 0,
        points: 0
      });
    });
  },

  goOrderList(e) {
    const status = e.currentTarget.dataset.status || '';
    wx.navigateTo({ url: '/pages/order/order?status=' + status });
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/address' });
  },

  goCoupon() {
    wx.navigateTo({ url: '/pages/coupon/coupon' });
  },

  goPoints() {
    wx.navigateTo({ url: '/pages/points/points' });
  },

  goFavorite() {
    wx.navigateTo({ url: '/pages/favorite/favorite' });
  },

  contactService() {
    wx.makePhoneCall({ phoneNumber: '400-123-4567' });
  },

  goAbout() {
    wx.navigateTo({ url: '/pages/about/about' });
  },

  goSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  }
});
