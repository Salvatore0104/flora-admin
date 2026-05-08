/**
 * 文件上传路由
 */
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadFile, deleteFile } = require('../utils/minio');

// 配置 multer（内存存储）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只能上传图片文件'), false);
    }
  }
});

/**
 * POST /api/upload
 * 上传单张图片
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ code: 400, msg: '请选择要上传的图片' });
    }
    
    const folder = req.body.folder || 'goods';
    const result = await uploadFile(req.file, folder);
    
    if (result.success) {
      res.json({
        code: 0,
        msg: '上传成功',
        data: {
          url: result.url,
          filename: result.filename
        }
      });
    } else {
      res.json({ code: 500, msg: '上传失败：' + result.error });
    }
  } catch (err) {
    console.error('Upload error:', err);
    res.json({ code: 500, msg: '上传失败：' + err.message });
  }
});

/**
 * DELETE /api/upload
 * 删除图片
 */
router.delete('/', async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.json({ code: 400, msg: '缺少文件名' });
    }
    
    const result = await deleteFile(filename);
    
    if (result.success) {
      res.json({ code: 0, msg: '删除成功' });
    } else {
      res.json({ code: 500, msg: '删除失败：' + result.error });
    }
  } catch (err) {
    console.error('Delete error:', err);
    res.json({ code: 500, msg: '删除失败：' + err.message });
  }
});

module.exports = router;
