// src/routes/pay.js - 支付路由
const express = require('express');
const router = express.Router();
const payController = require('../controllers/payController');
const auth = require('../middleware/auth');

// 统一下单
router.post('/unifiedOrder', auth, payController.unifiedOrder);

// 支付回调
router.post('/notify', payController.notify);

// 查询订单支付状态
router.get('/queryOrder/:orderId', auth, payController.queryOrder);

// 退款
router.post('/refund', auth, payController.refund);

module.exports = router;
