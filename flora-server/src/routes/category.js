// src/routes/category.js - 分类管理路由
const express = require('express');
const router = express.Router();
let db = null;

// 初始化数据库连接
try {
  db = require('../config/db');
} catch (err) {
  console.log('分类路由数据库配置不存在');
}

// 获取所有分类
router.get('/list', async (req, res) => {
  try {
    if (!db) {
      return res.json({ code: 500, message: '数据库未连接' });
    }
    
    const categories = await db.query(
      'SELECT * FROM categories WHERE status = 1 ORDER BY sort ASC, id ASC'
    );
    res.json({ code: 200, data: categories, categories: categories });
  } catch (err) {
    console.error('获取分类列表失败:', err);
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 获取单个分类
router.get('/:id', async (req, res) => {
  try {
    if (!db) {
      return res.json({ code: 500, message: '数据库未连接' });
    }
    
    const category = await db.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!category || category.length === 0) {
      return res.status(404).json({ code: 404, message: '分类不存在' });
    }
    res.json({ code: 200, data: category[0] });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 添加分类
router.post('/add', async (req, res) => {
  try {
    if (!db) {
      return res.json({ code: 500, message: '数据库未连接' });
    }
    
    const { name, icon, sort = 0, status = 1 } = req.body;
    
    if (!name) {
      return res.status(400).json({ code: 400, message: '分类名称不能为空' });
    }
    
    const result = await db.insert('categories', {
      name,
      icon: icon || '',
      sort,
      status
    });
    
    res.json({ code: 200, message: '添加成功', id: result.insertId });
  } catch (err) {
    console.error('添加分类失败:', err);
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 更新分类
router.put('/update/:id', async (req, res) => {
  try {
    if (!db) {
      return res.json({ code: 500, message: '数据库未连接' });
    }
    
    const { id } = req.params;
    const { name, icon, sort, status } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;
    if (sort !== undefined) updateData.sort = sort;
    if (status !== undefined) updateData.status = status;
    
    await db.update('categories', updateData, 'id = ?', [id]);
    
    res.json({ code: 200, message: '更新成功' });
  } catch (err) {
    console.error('更新分类失败:', err);
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 更新分类状态
router.put('/status/:id', async (req, res) => {
  try {
    if (!db) {
      return res.json({ code: 500, message: '数据库未连接' });
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    await db.update('categories', { status }, 'id = ?', [id]);
    
    res.json({ code: 200, message: '状态更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

// 删除分类
router.delete('/delete/:id', async (req, res) => {
  try {
    if (!db) {
      return res.json({ code: 500, message: '数据库未连接' });
    }
    
    const { id } = req.params;
    
    // 检查是否有商品使用该分类
    const goods = await db.query('SELECT COUNT(*) as count FROM goods WHERE category_id = ? AND status = 1', [id]);
    if (goods && goods[0] && goods[0].count > 0) {
      return res.status(400).json({ code: 400, message: '该分类下有商品，无法删除' });
    }
    
    // 软删除
    await db.update('categories', { status: -1 }, 'id = ?', [id]);
    
    res.json({ code: 200, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

module.exports = router;
