// pages/cart/cart.js
Page({
  data: {
    cartList: [],
    allSelected: false,
    isEditing: false,
    totalPrice: '0.00',
    selectedCount: 0
  },

  onShow() {
    this.loadCart();
  },

  loadCart() {
    const cart = wx.getStorageSync('cart') || [];
    const cartList = cart.map(item => ({
      ...item,
      selected: true
    }));
    this.setData({ cartList });
    this.calculateTotal();
  },

  toggleSelectAll() {
    const allSelected = !this.data.allSelected;
    const cartList = this.data.cartList.map(item => ({
      ...item,
      selected: allSelected
    }));
    this.setData({ cartList, allSelected });
    this.calculateTotal();
  },

  toggleSelect(e) {
    const index = e.currentTarget.dataset.index;
    const key = `cartList[${index}].selected`;
    this.setData({
      [key]: !this.data.cartList[index].selected
    });
    this.checkAllSelected();
    this.calculateTotal();
  },

  checkAllSelected() {
    const allSelected = this.data.cartList.every(item => item.selected);
    this.setData({ allSelected });
  },

  onQuantityMinus(e) {
    const index = e.currentTarget.dataset.index;
    if (this.data.cartList[index].quantity <= 1) return;
    const key = `cartList[${index}].quantity`;
    this.setData({
      [key]: this.data.cartList[index].quantity - 1
    });
    this.saveCart();
    this.calculateTotal();
  },

  onQuantityPlus(e) {
    const index = e.currentTarget.dataset.index;
    const key = `cartList[${index}].quantity`;
    this.setData({
      [key]: this.data.cartList[index].quantity + 1
    });
    this.saveCart();
    this.calculateTotal();
  },

  toggleEdit() {
    this.setData({ isEditing: !this.data.isEditing });
  },

  onDelete() {
    const cartList = this.data.cartList.filter(item => !item.selected);
    this.setData({ cartList });
    this.saveCart();
    this.calculateTotal();
  },

  onCheckout() {
    const selectedItems = this.data.cartList.filter(item => item.selected);
    if (selectedItems.length === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    wx.setStorageSync('checkoutItems', selectedItems);
    wx.navigateTo({ url: '/pages/order-confirm/order-confirm' });
  },

  calculateTotal() {
    const selected = this.data.cartList.filter(item => item.selected);
    const total = selected.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);
    const selectedCount = selected.reduce((sum, item) => sum + item.quantity, 0);
    this.setData({
      totalPrice: total.toFixed(2),
      selectedCount
    });
  },

  saveCart() {
    const cart = this.data.cartList.map(({ selected, ...rest }) => rest);
    wx.setStorageSync('cart', cart);
  },

  goShopping() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  goGoodsDetail(e) {
    wx.navigateTo({ url: '/pages/goods-detail/goods-detail?id=' + e.currentTarget.dataset.id });
  }
});
