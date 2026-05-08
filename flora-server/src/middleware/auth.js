// src/middleware/auth.js - 认证中间件 (支持Mock模式)
const jwt = require('jsonwebtoken');

// Mock 用户数据
const mockUser = { id: 1, openid: 'mock_openid_123' };

module.exports = async (req, res, next) => {
  try {
    // 获取token
    const token = req.headers['authorization']?.replace('Bearer ', '') || req.query.token || req.body.token;
    
    // 如果没有token但在开发模式，检查是否使用Mock
    if (!token) {
      // 检查是否在开发模式（可通过header判断）
      const devMode = req.headers['x-dev-mode'] === 'true';
      if (devMode || process.env.DEV_MODE === 'true') {
        req.user = mockUser;
        return next();
      }
      return res.status(401).json({ code: 401, message: '请先登录' });
    }
    
    // 验证token
    let decoded;
    try {
      decoded = jwt.verify(token, 'flora-admin-secret');
      req.user = { id: decoded.id || 1, openid: decoded.openid || mockUser.openid };
      return next();
    } catch (jwtErr) {
      // 如果是admin token
      if (decoded && decoded.role === 'admin') {
        req.user = { id: 1, openid: 'admin', role: 'admin' };
        return next();
      }
    }
    
    // 尝试数据库验证
    try {
      const db = require('../config/db');
      const config = require('../config');
      decoded = jwt.verify(token, config.jwtSecret);
      const [users] = await db.query('SELECT id, openid FROM users WHERE id = ?', [decoded.id]);
      
      if (users.length === 0) {
        return res.status(401).json({ code: 401, message: '用户不存在' });
      }
      
      req.user = {
        id: users[0].id,
        openid: users[0].openid
      };
      return next();
    } catch (dbErr) {
      // 无数据库，使用Mock用户
      req.user = mockUser;
      return next();
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 401, message: '登录已过期，请重新登录' });
    }
    return res.status(401).json({ code: 401, message: '认证失败' });
  }
};
