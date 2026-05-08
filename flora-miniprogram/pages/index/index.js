// pages/index/index.js - Flora花店首页逻辑
const app = getApp();
const api = require('../../utils/api.js').default;

// 本地图片基础路径
const IMG_BASE = '/images/';

Page({
  data: {
    banners: [],
    categories: [],
    seckillGoods: [],
    goodsList: [],
    countdown: '02:30:00',
    noMore: false,
    page: 1,
    loading: true,
    searchValue: ''
  },

  onLoad() {
    this.getHomeData();
    this.startCountdown();
  },

  onShow() {
    // 页面显示时刷新数据
  },

  onPullDownRefresh() {
    this.setData({ page: 1, goodsList: [], noMore: false });
    this.getHomeData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (!this.data.noMore) {
      this.loadMoreGoods();
    }
  },

  // 获取首页数据
  getHomeData() {
    return new Promise((resolve) => {
      api.getHomeData().then(res => {
        this.setData({
          banners: res.banners || [],
          categories: res.categories || [],
          seckillGoods: res.seckillGoods || [],
          goodsList: res.goodsList || [],
          loading: false
        });
        resolve();
      }).catch(err => {
        console.error('获取首页数据失败', err);
        this.setData({ loading: false });
        resolve();
      });
    });
  },

  // 开始倒计时
  startCountdown() {
    let totalSeconds = 2 * 3600 + 30 * 60;
    
    this.countdownTimer = setInterval(() => {
      totalSeconds--;
      if (totalSeconds <= 0) {
        clearInterval(this.countdownTimer);
        return;
      }
      
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      const countdown = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
      this.setData({ countdown });
    }, 1000);
  },

  padZero(num) {
    return num < 10 ? '0' + num : '' + num;
  },

  // 搜索相关
  onSearchInput(e) {
    this.setData({ searchValue: e.detail.value });
  },

  onSearch() {
    const value = this.data.searchValue;
    if (!value) {
      wx.showToast({ title: '请输入搜索关键词', icon: 'none' });
      return;
    }
    this.searchGoods(value);
  },

  searchGoods(keyword) {
    wx.showLoading({ title: '搜索中...' });
    api.searchGoods(keyword).then(res => {
      wx.hideLoading();
      if (res.goodsList && res.goodsList.length > 0) {
        this.setData({ goodsList: res.goodsList });
      } else {
        wx.showToast({ title: '未找到相关商品', icon: 'none' });
      }
    }).catch(() => {
      wx.hideLoading();
    });
  },

  // 轮播图点击
  onBannerTap(e) {
    const id = e.currentTarget.dataset.id;
    const link = e.currentTarget.dataset.link;
    if (link) {
      wx.navigateTo({ url: link });
    }
  },

  // 分类点击
  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `/pages/category/category?id=${id}&name=${encodeURIComponent(name)}`
    });
  },

  // 查看秒杀更多
  goSeckill() {
    wx.showToast({ title: '秒杀活动即将开始', icon: 'none' });
  },

  // 商品详情
  goGoodsDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/goods-detail/goods-detail?id=${id}`
    });
  },

  // 加入购物车
  addToCart(e) {
    const goods = e.currentTarget.dataset.goods;
    const cartList = wx.getStorageSync('cartList') || [];
    const existIndex = cartList.findIndex(item => item.id === goods.id);
    
    if (existIndex > -1) {
      cartList[existIndex].num += 1;
    } else {
      cartList.push({ ...goods, num: 1, selected: true });
    }
    
    wx.setStorageSync('cartList', cartList);
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },

  // 加载更多商品（商品图片由后台API控制）
  loadMoreGoods() {
    const page = this.data.page + 1;
    wx.showLoading({ title: '加载中...' });
    
    api.getGoodsList({ page, pageSize: 10 }).then(res => {
      wx.hideLoading();
      const newGoods = res.goodsList || [];
      if (newGoods.length === 0) {
        this.setData({ noMore: true });
        return;
      }
      this.setData({
        goodsList: this.data.goodsList.concat(newGoods),
        page: page
      });
    }).catch(() => {
      wx.hideLoading();
      // API失败时显示已加载完毕，不再使用假数据
      this.setData({ noMore: true });
      wx.showToast({ title: '暂无更多商品', icon: 'none' });
    });
  },

  onUnload() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }
});
