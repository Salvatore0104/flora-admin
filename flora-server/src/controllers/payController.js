// src/controllers/payController.js - 支付控制器
const wxPay = require('../utils/wxpay');
const db = require('../config/db');

// 统一下单
exports.unifiedOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;
    
    // 获取订单信息
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    
    const order = orders[0];
    
    // 调用微信支付统一下单接口
    const payParams = await wxPay.unifiedOrder({
      body: 'Flora花店-商品购买',
      out_trade_no: order.order_no,
      total_fee: Math.round(order.total_amount * 100), // 转换为分
      openid: req.user.openid
    });
    
    res.json({ code: 200, data: payParams });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 支付回调
exports.notify = async (req, res) => {
  try {
    const result = await wxPay.verifyNotify(req.body);
    
    if (result.success) {
      // 更新订单状态
      await db.query(
        'UPDATE orders SET status = ?, pay_time = NOW() WHERE order_no = ?',
        ['paid', result.out_trade_no]
      );
      
      res.send(wxPay.notifySuccess());
    } else {
      res.send(wxPay.notifyFail());
    }
  } catch (err) {
    console.error('支付回调处理失败：', err);
    res.send(wxPay.notifyFail());
  }
};

// 查询订单支付状态
exports.queryOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    
    const [orders] = await db.query(
      'SELECT status FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    
    res.json({ code: 200, data: { status: orders[0].status } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 退款
exports.refund = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const userId = req.user.id;
    
    // 获取订单信息
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    
    const order = orders[0];
    
    // 调用微信退款接口
    const refundResult = await wxPay.refund({
      out_trade_no: order.order_no,
      out_refund_no: 'RF' + Date.now(),
      total_fee: Math.round(order.total_amount * 100),
      refund_fee: Math.round(order.total_amount * 100),
      reason: reason
    });
    
    // 更新订单状态
    await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      ['refunding', orderId]
    );
    
    res.json({ code: 200, message: '退款申请已提交', data: refundResult });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};
