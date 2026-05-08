# Flora花店小程序部署指南

## 目录
1. [微信小程序AppID申请](#1-微信小程序appid申请)
2. [服务器准备](#2-服务器准备)
3. [数据库初始化](#3-数据库初始化)
4. [后端服务部署](#4-后端服务部署)
5. [后台管理系统部署](#5-后台管理系统部署)
6. [微信支付配置](#6-微信支付配置)
7. [小程序发布](#7-小程序发布)

---

## 1. 微信小程序AppID申请

### 1.1 注册小程序账号
1. 访问 微信公众平台
2. 点击"立即注册"，选择"小程序"
3. 填写邮箱、密码等信息完成注册

### 1.2 获取AppID
1. 登录微信公众平台
2. 进入"开发" -> "开发管理" -> "开发设置"
3. 在"开发者ID(AppID)"处可以看到你的AppID
4. 复制并保存AppID，后续开发需要用到

### 1.3 个人 vs 企业注册
| 功能 | 个人 | 企业 |
|------|------|------|
| 基础功能 | ✅ | ✅ |
| 微信支付 | ❌ | ✅ |
| 附近小程序 | ❌ | ✅ |
| 更多接口权限 | ❌ | ✅ |

> **建议**：如果要做正式商用，建议用企业资质注册，可以使用微信支付功能。

---

## 2. 服务器准备

### 2.1 购买云服务器
推荐选择以下云服务商：
- **腾讯云**：与微信生态集成好，推荐
- **阿里云**：性价比高
- **华为云**：国内服务稳定

**推荐配置**：
- CPU：2核
- 内存：4GB
- 硬盘：50GB SSD
- 带宽：3Mbps
- 操作系统：Ubuntu 20.04 LTS

### 2.2 域名和备案
1. 购买域名（如：yourdomain.com）
2. 进行ICP备案（约2-3周）
3. 申请SSL证书（HTTPS必需）

### 2.3 安装基础软件
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js (推荐v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 MySQL
sudo apt install -y mysql-server

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2 (进程管理)
sudo npm install -g pm2
```

---

## 3. 数据库初始化

### 3.1 创建数据库
```sql
CREATE DATABASE flora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3.2 创建数据表
```sql
-- 用户表
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(100) UNIQUE,
  nickname VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  points INT DEFAULT 0,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE goods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category_id INT,
  image TEXT,
  description TEXT,
  flower_meaning TEXT,
  sales INT DEFAULT 0,
  status ENUM('on','off') DEFAULT 'on',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  address_id INT,
  status ENUM('pending','paid','shipped','completed','cancelled','refunding','refunded') DEFAULT 'pending',
  remark TEXT,
  pay_time DATETIME,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 收货地址表
CREATE TABLE addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  detail TEXT,
  is_default BOOLEAN DEFAULT FALSE
);

-- 优惠券表
CREATE TABLE coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  min_amount DECIMAL(10,2) NOT NULL,
  expire_date DATE,
  status ENUM('active','inactive') DEFAULT 'active'
);
```

---

## 4. 后端服务部署

### 4.1 上传代码
```bash
# 将 flora-server 代码上传到服务器
scp -r flora-server/ user@your-server:/var/www/flora-server
```

### 4.2 安装依赖
```bash
cd /var/www/flora-server
npm install --production
```

### 4.3 配置环境变量
创建 `.env` 文件：
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flora_db
JWT_SECRET=your-secret-key
WX_APPID=your-wx-appid
WX_APPSECRET=your-wx-appsecret
WXPAY_APPID=your-wxpay-appid
WXPAY_MCHID=your-mch-id
WXPAY_KEY=your-api-key
```

### 4.4 启动服务
```bash
# 使用 PM2 启动
pm2 start app.js --name flora-server

# 查看状态
pm2 status

# 查看日志
pm2 logs flora-server
```

### 4.5 配置 Nginx 反向代理
编辑 `/etc/nginx/sites-available/flora`：
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.yourdomain.com;
    
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5. 后台管理系统部署

### 5.1 构建项目
```bash
cd flora-admin
npm install
npm run build
```

### 5.2 上传到服务器
```bash
scp -r dist/ user@your-server:/var/www/flora-admin
```

### 5.3 配置 Nginx
编辑 `/etc/nginx/sites-available/flora-admin`：
```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name admin.yourdomain.com;
    
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;
    
    root /var/www/flora-admin;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 6. 微信支付配置

### 6.1 申请微信支付商户号
1. 访问 微信支付商户平台
2. 注册并提交企业资质
3. 审核通过后获得商户号（MCHID）

### 6.2 配置API密钥
1. 登录微信支付商户平台
2. 进入"账户中心" -> "API安全"
3. 设置API密钥（32位密钥）

### 6.3 下载证书
1. 在商户平台下载API证书
2. 将证书上传到服务器 `flora-server/cert/` 目录

### 6.4 配置小程序支付
在 `flora-server/src/config/index.js` 中配置：
```javascript
wxPay: {
  appid: 'your-wx-appid',
  mchid: 'your-mch-id',
  key: 'your-api-key',
  certPath: './cert/apiclient_cert.pem',
  keyPath: './cert/apiclient_key.pem'
}
```

---

## 7. 小程序发布

### 7.1 配置服务器域名
1. 登录微信公众平台
2. 进入"开发" -> "开发管理" -> "开发设置"
3. 在"服务器域名"中添加：
   - request合法域名：`https://api.yourdomain.com`
   - uploadFile合法域名：`https://api.yourdomain.com`
   - downloadFile合法域名：`https://api.yourdomain.com`

### 7.2 修改小程序配置
在 `flora-miniprogram/app.js` 中修改：
```javascript
globalData: {
  baseUrl: 'https://api.yourdomain.com/api'
}
```

### 7.3 上传代码
1. 打开微信开发者工具
2. 点击"上传"按钮
3. 填写版本号和项目备注
4. 上传成功

### 7.4 提交审核
1. 登录微信公众平台
2. 进入"版本管理"
3. 点击"提交审核"
4. 填写审核信息
5. 等待审核（通常1-3天）

### 7.5 发布上线
审核通过后：
1. 在"版本管理"中点击"发布"
2. 小程序正式上线

---

## 常见问题

### Q1: 小程序无法请求后端API？
**A**: 检查是否在微信公众平台配置了服务器域名（必须是HTTPS）

### Q2: 微信支付失败？
**A**: 检查商户号、API密钥、证书是否正确配置

### Q3: 如何更新已发布的小程序？
**A**: 修改代码后重新上传、提交审核、发布

---

## 技术支持

如有问题，可以：
1. 查看微信官方文档
2. 检查服务器日志：`pm2 logs flora-server`
3. 联系开发者
