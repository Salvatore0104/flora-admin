// src/controllers/orderController.js - 订单控制器 (支持Mock数据)

// Mock 订单数据
const mockOrders = [
  {
    id: 1,
    orderNo: 'FL20240115001',
    userId: 1,
    items: [{ name: '红玫瑰', quantity: 2, price: 99 }],
    totalPrice: 198,
    status: 'completed',
    statusText: '已完成',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    orderNo: 'FL20240116001',
    userId: 1,
    items: [{ name: '白百合', quantity: 1, price: 128 }],
    totalPrice: 128,
    status: 'shipped',
    statusText: '已发货',
    createTime: '2024-01-16 14:20:00'
  },
  {
    id: 3,
    orderNo: 'FL20240117001',
    userId: 1,
    items: [{ name: '粉康乃馨', quantity: 3, price: 68 }],
    totalPrice: 204,
    status: 'paid',
    statusText: '已支付',
    createTime: '2024-01-17 09:15:00'
  },
  {
    id: 4,
    orderNo: 'FL20240118001',
    userId: 2,
    items: [{ name: '彩色郁金香', quantity: 1, price: 158 }],
    totalPrice: 158,
    status: 'pending',
    statusText: '待支付',
    createTime: '2024-01-18 16:45:00'
  }
];

// 判断是否使用数据库
let useDb = false;
let db = null;

try {
  db = require('../config/db');
  db.query('SELECT 1').then(() => {
    useDb = true;
    console.log('订单模块使用真实数据');
  }).catch(() => {
    useDb = false;
  });
} catch (err) {
  useDb = false;
}

// 获取订单列表
exports.getOrderList = async (req, res) => {
  try {
    const { status } = req.query;
    
    if (!useDb) {
      let result = [...mockOrders];
      if (status && status !== 'all') {
        result = result.filter(o => o.status === status);
      }
      return res.json({ code: 200, list: result });
    }
    
    const userId = req.user?.id || 1;
    let sql = 'SELECT * FROM orders WHERE user_id = ?';
    let params = [userId];
    
    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY create_time DESC';
    const [orders] = await db.query(sql, params);
    res.json({ code: 200, list: orders });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 获取订单详情
exports.getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!useDb) {
      const order = mockOrders.find(o => o.id === parseInt(id));
      if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在' });
      }
      return res.json({ code: 200, data: order });
    }
    
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    res.json({ code: 200, data: orders[0] });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 创建订单
exports.createOrder = async (req, res) => {
  try {
    const { goodsList, addressId, remark } = req.body;
    const orderNo = 'FL' + Date.now() + Math.floor(Math.random() * 1000);
    let totalAmount = goodsList.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    if (!useDb) {
      return res.json({ code: 200, message: '订单创建成功', orderId: mockOrders.length + 1, orderNo });
    }
    
    const [result] = await db.query(
      'INSERT INTO orders (order_no, user_id, total_amount, address_id, remark, status) VALUES (?, ?, ?, ?, ?, ?)',
      [orderNo, 1, totalAmount, addressId, remark, 'pending']
    );
    res.json({ code: 200, message: '订单创建成功', orderId: result.insertId, orderNo });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 取消订单
exports.cancelOrder = async (req, res) => {
  try {
    if (!useDb) {
      return res.json({ code: 200, message: '订单已取消' });
    }
    
    const { id } = req.params;
    await db.query('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', id]);
    res.json({ code: 200, message: '订单已取消' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 支付订单
exports.payOrder = async (req, res) => {
  try {
    if (!useDb) {
      return res.json({ code: 200, message: '支付成功', data: { prepay_id: 'mock_prepay_id' } });
    }
    
    res.json({ code: 200, message: '支付成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 确认收货
exports.confirmReceive = async (req, res) => {
  try {
    if (!useDb) {
      return res.json({ code: 200, message: '确认收货成功' });
    }
    
    const { id } = req.params;
    await db.query('UPDATE orders SET status = ? WHERE id = ?', ['completed', id]);
    res.json({ code: 200, message: '确认收货成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 管理员：获取所有订单
exports.getAllOrders = async (req, res) => {
  try {
    if (!useDb) {
      return res.json({ code: 200, list: mockOrders });
    }
    
    const [orders] = await db.query('SELECT * FROM orders ORDER BY create_time DESC');
    res.json({ code: 200, list: orders });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 管理员：更新订单状态
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!useDb) {
      return res.json({ code: 200, message: '状态更新成功' });
    }
    
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ code: 200, message: '状态更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};
