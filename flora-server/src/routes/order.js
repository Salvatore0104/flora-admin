// src/routes/order.js - 订单路由
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// 获取订单列表
router.get('/list', auth, orderController.getOrderList);

// 获取订单详情
router.get('/detail/:id', auth, orderController.getOrderDetail);

// 创建订单
router.post('/create', auth, orderController.createOrder);

// 取消订单
router.post('/cancel/:id', auth, orderController.cancelOrder);

// 支付订单
router.post('/pay/:id', auth, orderController.payOrder);

// 确认收货
router.post('/confirm/:id', auth, orderController.confirmReceive);

// 管理员接口
router.get('/all', auth, orderController.getAllOrders);
router.put('/status/:id', auth, orderController.updateOrderStatus);

module.exports = router;
