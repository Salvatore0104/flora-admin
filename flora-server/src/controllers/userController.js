// src/controllers/userController.js - 用户控制器
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const config = require('../config');

// 微信登录
exports.wxLogin = async (req, res) => {
  try {
    const { code } = req.body;
    
    // 调用微信接口获取openid
    const wxResult = await wxLogin(code);
    const { openid, session_key } = wxResult;
    
    // 查找或创建用户
    const [users] = await db.query('SELECT * FROM users WHERE openid = ?', [openid]);
    let userId;
    
    if (users.length === 0) {
      const [result] = await db.query(
        'INSERT INTO users (openid, create_time) VALUES (?, NOW())',
        [openid]
      );
      userId = result.insertId;
    } else {
      userId = users[0].id;
    }
    
    // 生成token
    const token = jwt.sign({ id: userId, openid }, config.jwtSecret, { expiresIn: '7d' });
    
    res.json({
      code: 200,
      data: { token, userId }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 获取用户信息
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await db.query('SELECT id, nickname, avatar_url, phone, points FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }
    
    res.json({ code: 200, data: users[0] });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 更新用户信息
exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nickname, avatar_url, phone } = req.body;
    
    await db.query(
      'UPDATE users SET nickname = ?, avatar_url = ?, phone = ? WHERE id = ?',
      [nickname, avatar_url, phone, userId]
    );
    
    res.json({ code: 200, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 获取收货地址列表
exports.getAddressList = async (req, res) => {
  try {
    const userId = req.user.id;
    const [addresses] = await db.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC', [userId]);
    res.json({ code: 200, data: addresses });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 添加收货地址
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, province, city, district, detail, is_default } = req.body;
    
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    }
    
    await db.query(
      'INSERT INTO addresses (user_id, name, phone, province, city, district, detail, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, phone, province, city, district, detail, is_default ? 1 : 0]
    );
    
    res.json({ code: 200, message: '添加成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 更新收货地址
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, phone, province, city, district, detail, is_default } = req.body;
    
    if (is_default) {
      await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
    }
    
    await db.query(
      'UPDATE addresses SET name = ?, phone = ?, province = ?, city = ?, district = ?, detail = ?, is_default = ? WHERE id = ? AND user_id = ?',
      [name, phone, province, city, district, detail, is_default ? 1 : 0, id, userId]
    );
    
    res.json({ code: 200, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 删除收货地址
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    await db.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ code: 200, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 获取优惠券
exports.getCoupons = async (req, res) => {
  try {
    const userId = req.user.id;
    const [coupons] = await db.query(
      'SELECT c.* FROM coupons c JOIN user_coupons uc ON c.id = uc.coupon_id WHERE uc.user_id = ? AND uc.status = ?',
      [userId, 'unused']
    );
    res.json({ code: 200, data: coupons });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 获取积分
exports.getPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await db.query('SELECT points FROM users WHERE id = ?', [userId]);
    res.json({ code: 200, data: { points: users[0].points } });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 微信登录辅助函数
async function wxLogin(code) {
  const axios = require('axios');
  const config = require('../config');
  
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${config.wxAppId}&secret=${config.wxAppSecret}&js_code=${code}&grant_type=authorization_code`;
  const res = await axios.get(url);
  return res.data;
}
