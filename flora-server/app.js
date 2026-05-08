// app.js - Flora花店后端服务入口
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件
app.use('/uploads', express.static('uploads'));

// 后台管理员登录接口
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username, role: 'admin' }, 'flora-admin-secret', { expiresIn: '7d' });
    res.json({
      code: 200,
      message: '登录成功',
      token,
      user: { id: 1, username: 'admin', nickname: '管理员', role: 'admin' }
    });
  } else {
    res.status(401).json({ code: 401, message: '用户名或密码错误' });
  }
});

// 获取管理员信息
app.get('/api/admin/info', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ code: 401, message: '未登录' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], 'flora-admin-secret');
    res.json({ code: 200, user: { id: 1, username: decoded.username, nickname: '管理员', role: 'admin' }});
  } catch {
    res.status(401).json({ code: 401, message: 'token无效' });
  }
});

// 路由
const goodsRouter = require('./src/routes/goods');
const orderRouter = require('./src/routes/order');
const userRouter = require('./src/routes/user');
const payRouter = require('./src/routes/pay');
const uploadRouter = require('./src/routes/upload');
const bannerRouter = require('./src/routes/banner');
const couponRouter = require('./src/routes/coupon');
const categoryRouter = require('./src/routes/category');

app.use('/api/goods', goodsRouter);
app.use('/api/order', orderRouter);
app.use('/api/user', userRouter);
app.use('/api/pay', payRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/banner', bannerRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/category', categoryRouter);

// 首页数据接口（小程序用）- 从数据库获取
app.get('/api/home/data', async (req, res) => {
  try {
    const db = require('./src/config/db');
    
    // 获取轮播图
    const banners = await db.query('SELECT * FROM banners WHERE status = 1 ORDER BY sort ASC LIMIT 5');
    
    // 获取分类
    const categories = await db.query('SELECT * FROM categories WHERE status = 1 ORDER BY sort ASC LIMIT 10');
    
    // 获取商品列表
    const goodsList = await db.query('SELECT * FROM goods WHERE status = 1 ORDER BY id DESC LIMIT 10');
    
    res.json({
      code: 200,
      banners,
      categories,
      goodsList
    });
  } catch (err) {
    console.error('获取首页数据失败:', err.message);
    // 如果数据库失败，返回错误
    res.status(500).json({ code: 500, message: '获取数据失败' });
  }
});

// 首页
app.get('/', (req, res) => {
  res.json({
    message: 'Flora花店API服务',
    version: '1.0.0',
    status: 'running',
    docs: '/api/home/data'
  });
});

// 后台管理统计API
app.get('/api/admin/stats', async (req, res) => {
  try {
    const db = require('./src/config/db');
    
    // 今日订单数
    const [todayOrders] = await db.query(
      "SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()"
    );
    
    // 今日销售额
    const [todaySales] = await db.query(
      "SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE DATE(created_at) = CURDATE() AND status >= 1"
    );
    
    // 商品总数
    const [goodsCount] = await db.query(
      "SELECT COUNT(*) as count FROM goods WHERE status = 1"
    );
    
    // 会员总数
    const [userCount] = await db.query(
      "SELECT COUNT(*) as count FROM users"
    );
    
    // 待发货订单
    const [pendingOrders] = await db.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 0"
    );
    
    // 待处理售后
    const [afterSales] = await db.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 6"
    );
    
    // 库存不足商品
    const [lowStock] = await db.query(
      "SELECT COUNT(*) as count FROM goods WHERE stock < 10 AND status = 1"
    );
    
    // 销售趋势（最近7天）
    const [salesTrend] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count, SUM(total_price) as sales 
      FROM orders 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND status >= 1
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    
    // 分类占比
    const [categoryStats] = await db.query(`
      SELECT c.name as label, COUNT(g.id) as goodsCount,
             ROUND(COUNT(g.id) * 100.0 / NULLIF((SELECT COUNT(*) FROM goods WHERE status = 1), 0), 1) as value
      FROM categories c
      LEFT JOIN goods g ON c.id = g.category_id AND g.status = 1
      WHERE c.status = 1
      GROUP BY c.id, c.name
      HAVING goodsCount > 0
      ORDER BY goodsCount DESC
    `);
    
    // 热门商品
    const [hotGoods] = await db.query(`
      SELECT id, name, sales, price 
      FROM goods 
      WHERE status = 1 
      ORDER BY sales DESC 
      LIMIT 5
    `);
    
    res.json({
      code: 200,
      data: {
        stats: {
          todayOrders: todayOrders?.count || 0,
          todaySales: todaySales?.total || 0,
          goodsCount: goodsCount?.count || 0,
          userCount: userCount?.count || 0
        },
        todos: {
          pendingOrders: pendingOrders?.count || 0,
          afterSales: afterSales?.count || 0,
          lowStock: lowStock?.count || 0
        },
        salesTrend: salesTrend || [],
        categoryStats: categoryStats || [],
        hotGoods: hotGoods || []
      }
    });
  } catch (err) {
    console.error('获取统计数据失败:', err);
    res.status(500).json({ code: 500, message: err.message });
  }
});

// MinIO配置API
app.get('/api/admin/settings', (req, res) => {
  const config = require('./src/config');
  res.json({
    code: 200,
    data: {
      minio: {
        endpoint: config.minio.endpoint,
        bucket: config.minio.bucket,
        useSSL: config.minio.useSSL
      }
    }
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: '服务器错误',
    error: err.message
  });
});

// 启动服务
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Flora服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;
