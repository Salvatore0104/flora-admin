// src/routes/goods.js - 商品路由
const express = require('express');
const router = express.Router();
const goodsController = require('../controllers/goodsController');

// 获取商品列表
router.get('/list', goodsController.getGoodsList);

// 获取商品详情
router.get('/detail/:id', goodsController.getGoodsDetail);

// 获取分类列表
router.get('/categories', goodsController.getCategories);

// 搜索商品
router.get('/search', goodsController.searchGoods);

// 管理员接口 - 需要认证
router.post('/add', goodsController.addGoods);
router.put('/update/:id', goodsController.updateGoods);
router.delete('/delete/:id', goodsController.deleteGoods);

module.exports = router;
