// utils/api.js - 小程序API请求封装
const app = getApp();

// 开发模式使用本地服务器，生产模式使用云API
const DEV_MODE = true; // 开发阶段设为true
const BASE_URL = DEV_MODE ? 'http://localhost:3000/api' : 'https://tcb-api.tencentcloudapi.com';

// 获取首页数据
export const getHomeData = () => {
  return request('/home/data');
};

// 获取商品列表
export const getGoodsList = (params = {}) => {
  return request('/goods/list', params);
};

// 获取商品详情
export const getGoodsDetail = (id) => {
  return request(`/goods/detail/${id}`);
};

// 获取分类
export const getCategories = () => {
  return request('/goods/categories');
};

// 搜索商品
export const searchGoods = (keyword) => {
  return request('/goods/search', { keyword });
};

// 获取轮播图
export const getBanners = () => {
  return request('/banner/list');
};

// 获取优惠券
export const getCoupons = () => {
  return request('/coupon/list');
};

// 领取优惠券
export const receiveCoupon = (couponId) => {
  return request.post('/coupon/receive', { couponId });
};

// 创建订单
export const createOrder = (data) => {
  return request.post('/order/create', data);
};

// 获取订单列表
export const getOrderList = () => {
  return request('/order/list');
};

// 获取订单详情
export const getOrderDetail = (id) => {
  return request(`/order/detail/${id}`);
};

// 微信登录
export const wxLogin = (code) => {
  return request.post('/user/login', { code });
};

// 获取用户信息
export const getUserInfo = () => {
  return request('/user/info');
};

// 获取收货地址
export const getAddressList = () => {
  return request('/user/address');
};

// 添加收货地址
export const addAddress = (data) => {
  return request.post('/user/address/add', data);
};

// 更新收货地址
export const updateAddress = (id, data) => {
  return request.put(`/user/address/update/${id}`, data);
};

// 删除收货地址
export const deleteAddress = (id) => {
  return request.delete(`/user/address/delete/${id}`);
};

// 支付订单
export const payOrder = (orderId) => {
  return request.post('/pay/create', { orderId });
};

// 取消订单
export const cancelOrder = (orderId) => {
  return request.post(`/order/cancel/${orderId}`);
};

// 确认收货
export const confirmReceive = (orderId) => {
  return request.post(`/order/confirm/${orderId}`);
};

// 封装请求
function request(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    const header = { 'Content-Type': 'application/json' };
    if (token) header['Authorization'] = `Bearer ${token}`;
    
    console.log(`[API] ${method} ${BASE_URL}${url}`);
    
    wx.request({
      url: BASE_URL + url,
      data,
      method,
      header,
      success: (res) => {
        console.log(`[API] Response:`, res.data);
        if (res.data.code === 200) {
          resolve(res.data);
        } else if (res.data.code === 401) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.showToast({ title: '请先登录', icon: 'none' });
          reject(res.data);
        } else {
          wx.showToast({ title: res.data.message || '请求失败', icon: 'none' });
          reject(res.data);
        }
      },
      fail: (err) => {
        console.error('[API] 请求失败', err);
        if (err.errMsg && err.errMsg.includes('url not in domain list')) {
          wx.showModal({
            title: '提示',
            content: '请在微信开发者工具中勾选"不校验合法域名"选项',
            showCancel: false
          });
        } else {
          wx.showToast({ title: '网络请求失败', icon: 'none' });
        }
        reject(err);
      }
    });
  });
}

// 扩展方法
request.post = (url, data) => request(url, data, 'POST');
request.put = (url, data) => request(url, data, 'PUT');
request.delete = (url) => request(url, {}, 'DELETE');

export default { getHomeData, getGoodsList, getGoodsDetail, getCategories, searchGoods, getBanners, getCoupons, receiveCoupon, createOrder, getOrderList, getOrderDetail, wxLogin, getUserInfo, getAddressList, addAddress, updateAddress, deleteAddress, payOrder, cancelOrder, confirmReceive };
