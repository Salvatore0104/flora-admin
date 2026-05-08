// src/routes/banner.js - 轮播图路由
const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const auth = require('../middleware/auth');

// 获取轮播图列表（小程序用，不需要认证）
router.get('/list', bannerController.getBannerList);

// 以下需要管理员权限
router.post('/add', auth, bannerController.addBanner);
router.put('/update/:id', auth, bannerController.updateBanner);
router.delete('/delete/:id', auth, bannerController.deleteBanner);

module.exports = router;
