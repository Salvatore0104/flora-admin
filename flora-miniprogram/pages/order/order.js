// pages/order/order.js - 订单页（订单数据由后台API控制）
const api = require('../../utils/api.js').default;

Page({
  data: {
    currentTab: 'all',
    orderList: [],
    loading: true
  },

  onLoad(options) {
    if (options.status) {
      this.setData({ currentTab: options.status });
    }
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadOrders();
  },

  // 加载订单列表（由API控制）
  loadOrders() {
    this.setData({ loading: true });
    
    api.getOrderList().then(res => {
      const allOrders = res.orders || [];
      
      // 状态映射
      const statusMap = {
        'pending': '待付款',
        'paid': '待发货',
        'shipped': '待收货',
        'completed': '已完成',
        'cancelled': '已取消'
      };
      
      // 添加状态文本
      allOrders.forEach(order => {
        order.statusText = statusMap[order.status] || order.status;
      });
      
      // 根据tab筛选
      let filtered = allOrders;
      if (this.data.currentTab !== 'all') {
        filtered = allOrders.filter(o => o.status === this.data.currentTab);
      }
      
      this.setData({ 
        orderList: filtered,
        loading: false
      });
    }).catch(() => {
      this.setData({ 
        orderList: [],
        loading: false
      });
    });
  },

  payOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/payment/payment?orderId=' + id
    });
  },

  confirmReceive(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认收货',
      content: '确认已收到商品？',
      success: (res) => {
        if (res.confirm) {
          api.confirmReceive(id).then(() => {
            wx.showToast({ title: '确认收货成功', icon: 'success' });
            this.loadOrders();
          }).catch(() => {
            wx.showToast({ title: '操作失败', icon: 'none' });
          });
        }
      }
    });
  },

  viewOrderDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?id=' + id
    });
  },

  goShopping() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
