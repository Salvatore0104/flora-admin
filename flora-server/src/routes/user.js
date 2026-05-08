// src/routes/user.js - 用户路由
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 微信登录
router.post('/login', userController.wxLogin);

// 获取用户信息
router.get('/info', userController.getUserInfo);

// 更新用户信息
router.put('/update', userController.updateUserInfo);

// 收货地址
router.get('/address', userController.getAddressList);
router.post('/address/add', userController.addAddress);
router.put('/address/update/:id', userController.updateAddress);
router.delete('/address/delete/:id', userController.deleteAddress);

// 优惠券
router.get('/coupon', userController.getCoupons);

// 积分
router.get('/points', userController.getPoints);

module.exports = router;
