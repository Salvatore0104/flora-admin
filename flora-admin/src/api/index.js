// src/api/index.js - 后台管理API
import request from './request';

// 登录
export const adminLogin = (data) => request.post('/admin/login', data);

// 首页统计
export const getDashboardStats = () => Promise.all([
  request.get('/goods/list'),
  request.get('/order/all'),
  request.get('/user/list')
]).then(([goods, orders, users]) => ({
  goodsCount: goods.goodsList?.length || 0,
  orderCount: orders.list?.length || 0,
  userCount: users.list?.length || 0,
  totalSales: (orders.list || []).reduce((sum, o) => sum + (o.totalPrice || 0), 0)
}));

// 商品API
export const getGoodsList = () => request.get('/goods/list');
export const getGoodsDetail = (id) => request.get(`/goods/detail/${id}`);
export const addGoods = (data) => request.post('/goods/add', data);
export const updateGoods = (id, data) => request.put(`/goods/update/${id}`, data);
export const deleteGoods = (id) => request.delete(`/goods/delete/${id}`);

// 分类API
export const getCategories = () => request.get('/goods/categories');
export const addCategory = (data) => request.post('/goods/category/add', data);
export const updateCategory = (id, data) => request.put(`/goods/category/update/${id}`, data);
export const deleteCategory = (id) => request.delete(`/goods/category/delete/${id}`);

// 轮播图API
export const getBanners = () => request.get('/banner/list');
export const addBanner = (data) => request.post('/banner/add', data);
export const updateBanner = (id, data) => request.put(`/banner/update/${id}`, data);
export const deleteBanner = (id) => request.delete(`/banner/delete/${id}`);

// 订单API
export const getOrderList = () => request.get('/order/all');
export const getOrderDetail = (id) => request.get(`/order/detail/${id}`);
export const updateOrderStatus = (id, status) => request.put(`/order/status/${id}`, { status });

// 用户API
export const getUserList = () => request.get('/user/list');
export const getUserDetail = (id) => request.get(`/user/detail/${id}`);
export const updateUser = (id, data) => request.put(`/user/update/${id}`, data);

// 优惠券API
export const getCouponList = () => request.get('/coupon/list');
export const addCoupon = (data) => request.post('/coupon/add', data);
export const updateCoupon = (id, data) => request.put(`/coupon/update/${id}`, data);
export const deleteCoupon = (id) => request.delete(`/coupon/delete/${id}`);

// 文件上传
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
