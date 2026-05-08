// pages/goods-detail/goods-detail.js - 商品详情页（图片由后台API控制）
const api = require('../../utils/api.js').default;

Page({
  data: {
    goodsId: '',
    goods: {},          // 由API获取
    goodsImages: [],    // 由API获取
    detailImages: [],   // 由API获取
    specs: [],          // 由API获取
    selectedSpec: '',
    quantity: 1,
    showSpec: false,
    cartCount: 0,
    loading: true,
    careTips: []        // 保养说明
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ goodsId: options.id });
      this.loadGoodsDetail(options.id);
    }
    this.getCartCount();
  },

  // 加载商品详情（由API控制，图片URL来自后台）
  loadGoodsDetail(id) {
    this.setData({ loading: true });
    api.getGoodsDetail(id).then(res => {
      const goods = res.goods || {};
      
      // 处理字段映射
      const formattedGoods = {
        id: goods.id,
        name: goods.name || '',
        price: goods.price || 0,
        originalPrice: goods.original_price || goods.price || 0,
        stock: goods.stock || 0,
        sales: goods.sales || 0,
        image: goods.image || '',
        desc: goods.description || '',
        flowerMeaning: goods.flower_meaning || '',
        category_name: goods.category_name || ''
      };
      
      // 处理商品图片
      let images = [];
      if (goods.images && Array.isArray(goods.images)) {
        images = goods.images;
      } else if (goods.image) {
        images = [goods.image];
      }
      
      // 处理详情图片
      let detailImgs = goods.detailImages || [];
      if (typeof detailImgs === 'string') {
        detailImgs = detailImgs ? [detailImgs] : [];
      }
      
      // 处理保养说明
      let careTips = [];
      if (goods.care_tips) {
        careTips = typeof goods.care_tips === 'string' ? goods.care_tips.split(',') : goods.care_tips;
      } else {
        // 默认保养说明
        careTips = ['保持室温15-25°C', '避免阳光直射', '每天换水并剪根', '远离空调和暖气'];
      }
      
      this.setData({
        goods: formattedGoods,
        goodsImages: images.length > 0 ? images : ['/images/default-goods.png'],
        detailImages: detailImgs,
        specs: goods.specs || [],
        careTips: careTips,
        loading: false
      });
      
      console.log('商品详情加载成功:', formattedGoods);
    }).catch((err) => {
      console.error('加载商品详情失败:', err);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  onPreviewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.goodsImages[index],
      urls: this.data.goodsImages
    });
  },

  showSpecPopup() {
    this.setData({ showSpec: true });
  },

  hideSpecPopup() {
    this.setData({ showSpec: false });
  },

  stopPropagation() {
    // 阻止冒泡
  },

  onSpecSelect(e) {
    const { groupIndex, itemIndex } = e.currentTarget.dataset;
    const specs = this.data.specs;
    specs[groupIndex].values.forEach((item, idx) => {
      item.selected = idx === itemIndex;
    });
    this.setData({ specs });
    
    // 更新选中的规格显示
    const selected = specs.map(group => {
      const selectedValue = group.values.find(v => v.selected);
      return selectedValue ? selectedValue.name : '';
    }).filter(Boolean).join('，');
    
    this.setData({ selectedSpec: selected });
  },

  onQuantityMinus() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 });
    }
  },

  onQuantityPlus() {
    if (this.data.goods.stock && this.data.quantity < this.data.goods.stock) {
      this.setData({ quantity: this.data.quantity + 1 });
    }
  },

  addToCart() {
    if (!this.data.selectedSpec && this.data.specs.length > 0) {
      wx.showToast({ title: '请选择规格', icon: 'none' });
      this.setData({ showSpec: true });
      return;
    }
    
    // 添加到购物车
    const cart = wx.getStorageSync('cart') || [];
    cart.push({
      goodsId: this.data.goodsId,
      name: this.data.goods.name,
      price: this.data.goods.price,
      spec: this.data.selectedSpec,
      quantity: this.data.quantity,
      image: this.data.goods.image
    });
    wx.setStorageSync('cart', cart);
    
    wx.showToast({ title: '已加入购物车', icon: 'success' });
    this.getCartCount();
    this.setData({ showSpec: false });
  },

  buyNow() {
    if (!this.data.selectedSpec && this.data.specs.length > 0) {
      wx.showToast({ title: '请选择规格', icon: 'none' });
      this.setData({ showSpec: true });
      return;
    }
    
    // 立即购买，跳转到确认订单页
    wx.navigateTo({
      url: '/pages/order-confirm/order-confirm?goodsId=' + this.data.goodsId + '&quantity=' + this.data.quantity + '&spec=' + this.data.selectedSpec
    });
  },

  getCartCount() {
    const cart = wx.getStorageSync('cart') || [];
    this.setData({ cartCount: cart.length });
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  goCart() {
    wx.switchTab({ url: '/pages/cart/cart' });
  },

  onShareAppMessage() {
    return {
      title: this.data.goods.name,
      path: '/pages/goods-detail/goods-detail?id=' + this.data.goodsId,
      imageUrl: this.data.goods.image
    };
  }
});
