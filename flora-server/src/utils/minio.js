/**
 * MinIO 对象存储工具
 * 用于存储和获取商品图片
 */
const Minio = require('minio');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const config = require('../config');

// 初始化 MinIO 客户端 - 使用 S3v4 API
const minioClient = new Minio.Client({
  endPoint: 'minio.ai.wowidea.top',
  port: 443,
  useSSL: true,
  accessKey: 'RtsEOoNriDxslz2902jC',
  secretKey: 'mtVVQDRLQIKxsTfkLHQKfFGWEmStQA9lD3fSnu5m',
  pathStyle: true // 使用路径风格
});

// 确保 Bucket 存在
async function ensureBucket() {
  try {
    const exists = await minioClient.bucketExists(config.minio.bucket);
    if (!exists) {
      await minioClient.makeBucket(config.minio.bucket);
      console.log(`Bucket ${config.minio.bucket} created successfully`);
    }
  } catch (err) {
    console.error('Error ensuring bucket:', err);
  }
}

// 上传文件到 MinIO
async function uploadFile(file, folder = 'goods') {
  try {
    await ensureBucket();
    
    // 获取文件扩展名
    const ext = path.extname(file.originalname) || '.jpg';
    // 生成唯一文件名
    const filename = `${folder}/${uuidv4()}${ext}`;
    
    // 上传文件
    await minioClient.putObject(
      config.minio.bucket,
      filename,
      file.buffer,
      file.size,
      file.mimetype
    );
    
    // 返回文件 URL - 使用path-style格式
    const url = `https://minio.ai.wowidea.top/flora/${filename}`;
    
    return {
      success: true,
      url: url,
      filename: filename
    };
  } catch (err) {
    console.error('Error uploading file:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

// 删除 MinIO 中的文件
async function deleteFile(filename) {
  try {
    await minioClient.removeObject(config.minio.bucket, filename);
    return { success: true };
  } catch (err) {
    console.error('Error deleting file:', err);
    return { success: false, error: err.message };
  }
}

// 获取文件的临时访问 URL（带签名）
async function getPresignedUrl(filename, expiry = 3600) {
  try {
    const url = await minioClient.presignedGetObject(
      config.minio.bucket,
      filename,
      expiry
    );
    return { success: true, url };
  } catch (err) {
    console.error('Error getting presigned URL:', err);
    return { success: false, error: err.message };
  }
}

module.exports = {
  minioClient,
  ensureBucket,
  uploadFile,
  deleteFile,
  getPresignedUrl
};
