// pages/coupon/coupon.js
Page({
  data: {
    currentTab: 0,
    couponList: []
  },

  onLoad() {
    this.loadCoupons();
  },

  switchTab(e) {
    const tab = parseInt(e.currentTarget.dataset.tab);
    this.setData({ currentTab: tab });
    this.loadCoupons();
  },

  loadCoupons() {
    const status = this.data.currentTab;
    let couponList = [];
    
    if (status === 0) {
      couponList = [
        { id: 1, name: '新人专享券', amount: '20', minAmount: '99', expireDate: '2026-06-30', desc: '全品类通用' },
        { id: 2, name: '鲜花满减券', amount: '10', minAmount: '59', expireDate: '2026-05-20', desc: '仅限鲜花类商品' }
      ];
    } else if (status === 1) {
      couponList = [
        { id: 3, name: '已使用券', amount: '15', minAmount: '79', expireDate: '2026-04-01', desc: '已使用' }
      ];
    } else {
      couponList = [];
    }
    
    this.setData({ couponList });
  },

  useCoupon(e) {
    const id = e.currentTarget.dataset.id;
    wx.switchTab({ url: '/pages/index/index' });
  }
});
