// src/controllers/goodsController.js - 商品控制器 (真实数据库)
let db = null;

// 初始化数据库连接
try {
  db = require('../config/db');
} catch (err) {
  console.log('数据库配置不存在');
}

// 获取商品列表
exports.getGoodsList = async (req, res) => {
  try {
    const { category_id, page = 1, limit = 10, sort = 'default', keyword } = req.query;
    
    if (!db) {
      return res.status(500).json({ code: 500, message: '数据库未连接' });
    }
    
    const offset = (page - 1) * limit;
    let sql = `SELECT g.*, c.name as category_name 
               FROM goods g 
               LEFT JOIN categories c ON g.category_id = c.id 
               WHERE g.status = 1`;
    let params = [];
    
    if (category_id) {
      sql += ' AND g.category_id = ?';
      params.push(parseInt(category_id));
    }
    
    if (keyword) {
      sql += ' AND (g.name LIKE ? OR g.description LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    
    sql += ' ORDER BY ';
    switch(sort) {
      case 'sales': sql += 'g.sales DESC'; break;
      case 'price-asc': sql += 'g.price ASC'; break;
      case 'price-desc': sql += 'g.price DESC'; break;
      default: sql += 'g.id DESC';
    }
    
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const goods = await db.query(sql, params);
    
    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM goods WHERE status = 1';
    let countParams = [];
    if (category_id) {
      countSql += ' AND category_id = ?';
      countParams.push(parseInt(category_id));
    }
    if (keyword) {
      countSql += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${keyword}%`, `%${keyword}%`);
    }
    const countResult = await db.query(countSql, countParams);
    
    res.json({ code: 200, message: 'success', goodsList: goods, total: countResult.total || goods.length });
  } catch (err) {
    console.error('获取商品列表失败:', err);
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 获取商品详情
exports.getGoodsDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!db) {
      return res.status(500).json({ code: 500, message: '数据库未连接' });
    }
    
    const [goods] = await db.query(
      `SELECT g.*, c.name as category_name 
       FROM goods g 
       LEFT JOIN categories c ON g.category_id = c.id 
       WHERE g.id = ?`,
      [id]
    );
    
    if (goods.length === 0) {
      return res.status(404).json({ code: 404, message: '商品不存在' });
    }
    res.json({ code: 200, goods: goods[0] });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 获取分类列表
exports.getCategories = async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ code: 500, message: '数据库未连接' });
    }
    
    const categories = await db.query('SELECT * FROM categories WHERE status = 1 ORDER BY sort ASC, id ASC');
    res.json({ code: 200, data: categories });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 搜索商品
exports.searchGoods = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!db) {
      return res.status(500).json({ code: 500, message: '数据库未连接' });
    }
    
    const goods = await db.query(
      `SELECT g.*, c.name as category_name 
       FROM goods g 
       LEFT JOIN categories c ON g.category_id = c.id 
       WHERE g.status = 1 AND (g.name LIKE ? OR g.description LIKE ?)`,
      [`%${keyword}%`, `%${keyword}%`]
    );
    res.json({ code: 200, data: goods });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 添加商品
exports.addGoods = async (req, res) => {
  try {
    const { name, price, original_price, stock, category_id, image, description, is_hot, is_new } = req.body;
    
    if (!db) {
      return res.status(500).json({ code: 500, message: '数据库未连接' });
    }
    
    const result = await db.insert('goods', {
      name,
      price,
      original_price: original_price || price,
      stock: stock || 0,
      category_id: category_id || null,
      image: image || '',
      description: description || '',
      is_hot: is_hot ? 1 : 0,
      is_new: is_new ? 1 : 0,
      status: 1
    });
    
    res.json({ code: 200, message: '添加成功', id: result.insertId });
  } catch (err) {
    console.error('添加商品失败:', err);
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 更新商品
exports.updateGoods = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, original_price, stock, category_id, image, description, is_hot, is_new, status } = req.body;
    
    if (!db) {
      return res.status(500).json({ code: 500, message: '数据库未连接' });
    }
    
    await db.update('goods', {
      name,
      price,
      original_price,
      stock,
      category_id,
      image,
      description,
      is_hot: is_hot ? 1 : 0,
      is_new: is_new ? 1 : 0,
      status
    }, 'id = ?', [id]);
    
    res.json({ code: 200, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};

// 删除商品
exports.deleteGoods = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!db) {
      return res.status(500).json({ code: 500, message: '数据库未连接' });
    }
    
    // 软删除
    await db.update('goods', { status: 0 }, 'id = ?', [id]);
    res.json({ code: 200, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
};
