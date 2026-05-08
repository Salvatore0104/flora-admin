// src/routes/coupon.js - 优惠券路由
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const auth = require('../middleware/auth');

// 获取优惠券列表（小程序用）
router.get('/list', couponController.getCouponList);

// 以下需要管理员权限
router.post('/add', auth, couponController.addCoupon);
router.put('/update/:id', auth, couponController.updateCoupon);
router.delete('/delete/:id', auth, couponController.deleteCoupon);

module.exports = router;
