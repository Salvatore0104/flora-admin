// src/config/index.js - 项目配置文件
module.exports = {
  // 服务器配置
  port: process.env.PORT || 3000,
  
  // JWT密钥
  jwtSecret: process.env.JWT_SECRET || 'flora-secret-key-2024',
  jwtExpire: '7d',
  
  // 微信配置
  wxAppId: process.env.WX_APPID || 'your-wx-appid',
  wxAppSecret: process.env.WX_APPSECRET || 'your-wx-appsecret',
  
  // 微信支付配置
  wxPay: {
    appid: process.env.WXPAY_APPID || 'your-wxpay-appid',
    mchid: process.env.WXPAY_MCHID || 'your-mch-id',
    key: process.env.WXPAY_KEY || 'your-api-key',
    certPath: process.env.WXPAY_CERTPATH || './cert/apiclient_cert.pem',
    keyPath: process.env.WXPAY_KEYPATH || './cert/apiclient_key.pem'
  },
  
  // 数据库配置（也可通过环境变量覆盖）
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'flora_db'
  },

  // MinIO 对象存储配置（用于存储商品图片）
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'minio.ai.wowidea.top',
    accessKey: process.env.MINIO_ACCESS_KEY || 'RtsEOoNriDxslz2902jC',
    secretKey: process.env.MINIO_SECRET_KEY || 'mtVVQDRLQIKxsTfkLHQKfFGWEmStQA9lD3fSnu5m',
    bucket: process.env.MINIO_BUCKET || 'flora',
    useSSL: process.env.MINIO_USE_SSL === 'true' || true
  }
};
