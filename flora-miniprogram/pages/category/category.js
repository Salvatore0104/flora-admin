// pages/category/category.js - 分类页（商品图片由后台API控制）
const api = require('../../utils/api.js').default;

Page({
  data: {
    currentCategory: 0,
    currentSort: 'default',
    categories: [],  // 由API获取
    goodsList: [],    // 由API获取
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ currentCategory: parseInt(options.id) - 1 });
    }
    this.loadCategories();
  },

  // 加载分类数据（由API控制）
  loadCategories() {
    api.getCategories().then(res => {
      this.setData({
        categories: res.categories || [],
        loading: false
      });
      if (this.data.categories.length > 0) {
        this.loadGoods();
      }
    }).catch(() => {
      this.setData({ loading: false });
      wx.showToast({ title: '加载分类失败', icon: 'none' });
    });
  },

  onCategorySelect(e) {
    this.setData({ currentCategory: e.currentTarget.dataset.index });
    this.loadGoods();
  },

  onSubCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/goods-list/goods-list?subCatId=' + id });
  },

  onSortChange(e) {
    this.setData({ currentSort: e.currentTarget.dataset.sort });
    this.loadGoods();
  },

  onSearch() {
    const value = this.data.searchValue;
    if (value) {
      wx.navigateTo({ url: '/pages/search/search?keyword=' + value });
    }
  },

  onSearchInput(e) {
    this.setData({ searchValue: e.detail.value });
  },

  goGoodsDetail(e) {
    wx.navigateTo({ url: '/pages/goods-detail/goods-detail?id=' + e.currentTarget.dataset.id });
  },

  // 加载商品数据（由API控制，图片URL来自后台）
  loadGoods() {
    const category = this.data.categories[this.data.currentCategory];
    if (!category) return;
    
    api.getGoodsList({ categoryId: category.id, sort: this.data.currentSort }).then(res => {
      this.setData({
        goodsList: res.goodsList || []
      });
    }).catch(() => {
      this.setData({ goodsList: [] });
    });
  }
});
