# Flora花店小程序从零配置指南

本文档提供从零开始配置 Flora 花店小程序的完整指南，适合没有任何基础的用户。

---

## 目录

1. [前期准备](#1-前期准备)
2. [微信小程序账号注册](#2-微信小程序账号注册)
3. [开发环境搭建](#3-开发环境搭建)
4. [服务器购买和配置](#4-服务器购买和配置)
5. [域名购买和备案](#5-域名购买和备案)
6. [SSL证书申请](#6-ssl证书申请)
7. [项目部署](#7-项目部署)
8. [微信支付配置](#8-微信支付配置)
9. [小程序发布](#9-小程序发布)

---

## 1. 前期准备

### 1.1 所需材料清单

**个人开发者**：
- 邮箱（未注册过微信公众平台的）
- 手机号
- 身份证正反面照片
- 微信账号

**企业开发者**（推荐，可使用微信支付）：
- 企业营业执照
- 对公账户信息
- 法人身份证正反面照片
- 运营者身份证正反面照片
- 企业邮箱
- 企业微信账号

### 1.2 费用预算

| 项目 | 个人 | 企业 |
|------|------|------|
| 微信小程序注册 | 免费 | 300元/年（认证费） |
| 云服务器（基础配置） | 约500元/年 | 约500元/年 |
| 域名 | 约50元/年 | 约50元/年 |
| SSL证书 | 免费 或 约1000元/年 | 免费 或 约1000元/年 |
| 微信支付商户号 | 不支持 | 免费（需企业资质） |
| **总计** | 约550元/年 | 约1850元/年 |

---

## 2. 微信小程序账号注册

### 2.1 个人账号注册（无微信支付）

1. **访问微信公众平台**
   - 打开 https://mp.weixin.qq.com/
   - 点击右上角"立即注册"

2. **选择账号类型**
   - 选择"小程序"
   - 填写邮箱、密码、验证码
   - 激活邮箱（点击邮件中的链接）

3. **主体信息登记**
   - 选择"个人"
   - 填写管理员身份信息（姓名、身份证号）
   - 用微信扫码验证管理员身份

4. **获取AppID**
   - 登录小程序后台
   - 进入"开发" → "开发管理" → "开发设置"
   - 复制"开发者ID(AppID)"，保存备用

### 2.2 企业账号注册（有微信支付）

1. **注册流程**
   - 同上述步骤1-2

2. **主体信息登记**
   - 选择"企业"
   - 填写企业信息（营业执照注册号、企业名称等）
   - 选择认证方式（微信认证，需支付300元/年）
   - 上传营业执照照片
   - 填写管理员信息并用微信扫码验证

3. **微信认证**
   - 支付认证费用（300元/年）
   - 等待审核（约1-3个工作日）
   - 认证通过后，即可使用微信支付等功能

4. **获取AppID**
   - 同上述步骤4

---

## 3. 开发环境搭建

### 3.1 安装微信开发者工具

1. **下载微信开发者工具**
   - 访问 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   - 选择对应操作系统版本（Windows 64位）
   - 下载并安装

2. **登录微信开发者工具**
   - 打开微信开发者工具
   - 扫码登录（使用注册小程序的管理员微信）

3. **创建小程序项目**
   - 点击"+"号创建项目
   - 填写"AppID"（使用上一步获取的AppID）
   - 项目名称：Flora花店小程序
   - 选择"不使用云服务"
   - 点击"确定"

### 3.2 安装Node.js和npm

1. **下载Node.js**
   - 访问 https://nodejs.org/
   - 下载LTS版本（推荐v18+）
   - 安装时勾选"npm package manager"

2. **验证安装**
   ```bash
   # 打开命令提示符（CMD）或 PowerShell
   node -v
   npm -v
   ```
   应该显示版本号，如：v18.16.0 和 9.5.1

### 3.3 安装MySQL数据库

1. **下载MySQL**
   - 访问 https://dev.mysql.com/downloads/mysql/
   - 下载MySQL Installer for Windows
   - 安装时选择"Server only"或"Full"配置

2. **配置MySQL**
   - 设置root密码（请牢记）
   - 勾选"Configure MySQL Server as a Windows Service"
   - 完成安装

3. **验证MySQL**
   ```bash
   # 打开命令提示符
   mysql -u root -p
   # 输入密码后，应该看到 MySQL 提示符
   ```

### 3.4 安装Git（可选，推荐）

1. **下载Git**
   - 访问 https://git-scm.com/
   - 下载Windows版本并安装

2. **配置Git**
   ```bash
   git config --global user.name "你的名字"
   git config --global user.email "你的邮箱"
   ```

---

## 4. 服务器购买和配置

### 4.1 购买云服务器

**推荐云服务商**：
- **腾讯云**：与微信生态集成好，推荐
- **阿里云**：性价比高，国内用户多
- **华为云**：国内服务稳定

**推荐配置**（初期）：
- CPU：2核
- 内存：4GB
- 硬盘：50GB SSD
- 带宽：3Mbps
- 操作系统：Ubuntu 20.04 LTS 或 Windows Server 2019
- 价格：约40-60元/月

**购买步骤**（以腾讯云为例）：
1. 访问 https://cloud.tencent.com/
2. 注册账号并完成实名认证
3. 进入"云服务器" → "实例" → "新建实例"
4. 选择配置和操作系统
5. 设置登录密码
6. 完成支付

### 4.2 连接服务器

**Windows系统**：
1. 下载PuTTY（SSH客户端）
2. 打开PuTTY，输入服务器公网IP
3. 点击"Open"，输入用户名（通常是ubuntu）和密码

**或者使用Windows自带的SSH**：
```powershell
ssh username@server-ip
```

### 4.3 安装基础软件（Ubuntu系统）

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装 Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # 验证安装
npm -v   # 验证安装

# 3. 安装 MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation  # 安全配置

# 4. 安装 Nginx（Web服务器）
sudo apt install -y nginx

# 5. 安装 PM2（Node.js进程管理器）
sudo npm install -g pm2

# 6. 安装 Git
sudo apt install -y git
```

### 4.4 配置MySQL数据库

```bash
# 登录MySQL
sudo mysql

# 在MySQL提示符下执行：
CREATE DATABASE flora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'flora_user'@'localhost' IDENTIFIED BY 'your-strong-password';
GRANT ALL PRIVILEGES ON flora_db.* TO 'flora_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 5. 域名购买和备案

### 5.1 购买域名

1. **选择域名注册商**
   - 腾讯云：https://dnspod.cloud.tencent.com/
   - 阿里云：https://wanwang.aliyun.com/
   - 华为云：https://www.huaweicloud.com/product/domain.html

2. **选择域名**
   - 推荐后缀：.com、.cn、.net
   - 域名建议：简短、易记、与花店相关
   - 示例：florashop.com、myflower.cn

3. **完成购买**
   - 查询域名是否可注册
   - 填写域名信息（个人/企业信息）
   - 完成支付

### 5.2 域名备案（必须，约2-3周）

**注意**：如果服务器在国内，域名必须备案才能访问。

1. **进入备案系统**
   - 登录云服务商控制台
   - 找到"备案"入口

2. **填写备案信息**
   - 个人备案：身份证照片、人脸识别
   - 企业备案：营业执照、法人身份证、网站负责人身份证

3. **上传资料**
   - 按照提示上传所需资料
   - 填写网站信息（网站名称、简介等）

4. **等待审核**
   - 云服务商初审（1-2天）
   - 工信部审核（约2-3周）

5. **备案完成**
   - 获得备案号（如：粤ICP备XXXXXXXX号）
   - 将备案号放置在网站底部

### 5.3 域名解析

1. **进入DNS管理**
   - 登录域名注册商控制台
   - 找到"域名解析"或"DNS管理"

2. **添加解析记录**
   ```
   记录类型：A
   主机记录：api
   记录值：你的服务器公网IP
   TTL：600
   
   记录类型：A
   主机记录：admin
   记录值：你的服务器公网IP
   TTL：600
   ```

   这样，你就有了两个域名：
   - `api.yourdomain.com`（后端API）
   - `admin.yourdomain.com`（后台管理系统）

---

## 6. SSL证书申请

### 6.1 申请免费SSL证书（推荐）

**使用Let's Encrypt（免费，需定期续期）**：

```bash
# 在服务器上安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d api.yourdomain.com -d admin.yourdomain.com

# 自动续期（Certbot会自动配置）
sudo certbot renew --dry-run
```

**或者使用云服务商提供的免费证书**：
1. 登录云服务商控制台
2. 找到"SSL证书"服务
3. 申请免费证书（通常有效期1年）
4. 下载证书文件（.crt 和 .key）

### 6.2 安装SSL证书

**如果使用了Let's Encrypt，Certbot会自动配置Nginx**。

**如果手动申请了证书**：
1. 将证书文件上传到服务器（如：`/etc/nginx/ssl/`）
2. 配置Nginx（参考下一节）

---

## 7. 项目部署

### 7.1 上传项目代码到服务器

**方法一：使用Git（推荐）**

```bash
# 在服务器上
cd /var/www
sudo git clone https://github.com/你的用户名/Flora.git
sudo chown -R $USER:$USER /var/www/Flora
```

**方法二：使用FTP/SFTP**

1. 安装FileZilla（FTP客户端）
2. 连接到服务器
3. 上传项目文件夹

### 7.2 配置后端服务（flora-server）

```bash
# 1. 进入后端目录
cd /var/www/Flora/flora-server

# 2. 安装依赖
npm install --production

# 3. 创建环境变量文件
cat > .env << EOL
DB_HOST=localhost
DB_PORT=3306
DB_USER=flora_user
DB_PASSWORD=your-strong-password
DB_NAME=flora_db
JWT_SECRET=your-jwt-secret-key
WX_APPID=你的小程序AppID
WX_APPSECRET=你的小程序AppSecret
WXPAY_APPID=你的微信支付AppID
WXPAY_MCHID=你的商户号
WXPAY_KEY=你的API密钥
EOL

# 4. 初始化数据库
mysql -u flora_user -p flora_db < docs/database.sql

# 5. 启动服务（使用PM2）
pm2 start app.js --name flora-server
pm2 save
pm2 startup  # 设置开机自启
```

### 7.3 配置Nginx反向代理

创建Nginx配置文件：

```bash
sudo nano /etc/nginx/sites-available/flora-api
```

粘贴以下内容：

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
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

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/flora-api /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl restart nginx
```

### 7.4 部署后台管理系统（flora-admin）

```bash
# 1. 在本地构建项目
cd d:\Github\Flora\flora-admin
npm install
npm run build

# 2. 上传构建后的文件到服务器
# 使用FileZilla或其他FTP工具上传 dist/ 目录到服务器
# 目标位置：/var/www/flora-admin/

# 3. 配置Nginx
sudo nano /etc/nginx/sites-available/flora-admin
```

粘贴以下内容：

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name admin.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/admin.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.yourdomain.com/privkey.pem;
    
    root /var/www/flora-admin;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/flora-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7.5 配置小程序服务器域名

1. 登录微信公众平台
2. 进入"开发" → "开发管理" → "开发设置"
3. 在"服务器域名"中点击"修改"
4. 添加以下域名：
   - request合法域名：`https://api.yourdomain.com`
   - uploadFile合法域名：`https://api.yourdomain.com`
   - downloadFile合法域名：`https://api.yourdomain.com`
5. 点击"保存"

### 7.6 修改小程序配置

在微信开发者工具中：
1. 打开 `flora-miniprogram/app.js`
2. 修改 `baseUrl`：
   ```javascript
   globalData: {
     baseUrl: 'https://api.yourdomain.com/api'
   }
   ```
3. 保存并编译

---

## 8. 微信支付配置

### 8.1 申请微信支付商户号

**注意**：只有企业资质的小程序才能使用微信支付。

1. **登录微信支付商户平台**
   - 访问 https://pay.weixin.qq.com/
   - 点击"立即注册"
   - 选择"企业"

2. **填写企业信息**
   - 上传营业执照
   - 填写对公账户信息
   - 填写联系人信息

3. **等待审核**
   - 审核时间：约1-3个工作日
   - 审核通过后，会收到商户号（MCHID）

### 8.2 配置API密钥

1. **登录微信支付商户平台**
   - 使用步骤8.1中注册的商户号登录

2. **设置API密钥**
   - 进入"账户中心" → "API安全"
   - 点击"设置密钥"
   - 输入32位密钥（可随机生成）
   - **重要**：请牢记此密钥，后续配置需要

3. **下载API证书**
   - 在同一页面，点击"申请证书"
   - 下载证书文件（apiclient_cert.pem 和 apiclient_key.pem）
   - 将证书上传到服务器：`/var/www/Flora/flora-server/cert/`

### 8.3 配置小程序支付

1. **关联小程序和商户号**
   - 登录微信公众平台（小程序后台）
   - 进入"微信支付" → "支付申请"
   - 输入商户号，完成关联

2. **配置后端**
   - 编辑 `/var/www/Flora/flora-server/.env` 文件
   - 填写以下内容：
     ```
     WXPAY_APPID=你的小程序AppID
     WXPAY_MCHID=你的商户号
     WXPAY_KEY=你的API密钥
     ```

3. **重启后端服务**
   ```bash
   pm2 restart flora-server
   ```

---

## 9. 小程序发布

### 9.1 测试小程序

1. **在微信开发者工具中测试**
   - 点击"编译"按钮
   - 测试所有功能（浏览商品、加购物车、下单等）
   - 检查是否有报错

2. **真机调试**
   - 点击"预览"按钮
   - 用手机微信扫码
   - 在真实环境中测试

### 9.2 上传代码

1. **修改项目配置**
   - 在微信开发者工具中
   - 点击"详情" → "本地设置"
   - 确保"不校验合法域名"未勾选（正式上传前）

2. **上传代码**
   - 点击顶部"上传"按钮
   - 填写版本号（如：1.0.0）
   - 填写项目备注（如：首次发布）
   - 点击"上传"

### 9.3 提交审核

1. **登录微信公众平台**
   - 进入"版本管理"

2. **提交审核**
   - 找到刚刚上传的版本
   - 点击"提交审核"
   - 填写审核信息：
     - 功能页面：选择小程序的首页
     - 测试账号：填写测试用的账号密码（如有）
     - 审核说明：简要描述小程序功能
   - 点击"提交审核"

3. **等待审核**
   - 审核时间：通常1-3天
   - 审核结果会通过微信通知

### 9.4 发布上线

1. **审核通过后**
   - 登录微信公众平台
   - 进入"版本管理"
   - 找到审核通过的版本
   - 点击"发布"

2. **小程序正式上线**
   - 用户可以通过搜索小程序名称找到你的花店小程序
   - 也可以通过扫码、分享等方式进入

### 9.5 后续更新

1. **修改代码**
   - 在微信开发者工具中修改代码
   - 本地测试通过

2. **上传新版本**
   - 点击"上传"按钮
   - 填写新版本号（如：1.0.1）
   - 上传成功

3. **提交审核**
   - 同步骤9.3

4. **发布新版本**
   - 同步骤9.4

---

## 常见问题（FAQ）

### Q1: 个人注册的小程序可以使用微信支付吗？
**A**: 不可以。个人注册的小程序无法使用微信支付功能，只能做展示型小程序。如果需要微信支付，必须使用企业资质注册。

### Q2: 域名备案需要多长时间？
**A**: 通常需要2-3周。建议提前申请备案，以免影响上线计划。

### Q3: 小程序审核不通过怎么办？
**A**: 查看审核反馈，根据反馈修改小程序内容或功能，然后重新提交审核。

### Q4: 如何查看小程序的后端日志？
**A**: 登录服务器，执行以下命令：
```bash
pm2 logs flora-server
```

### Q5: 小程序上线后，如何修改服务器域名？
**A**: 
1. 在微信公众平台修改"服务器域名"
2. 重新上传小程序代码
3. 提交审核并发布

### Q6: 如何备份数据库？
**A**: 
```bash
mysqldump -u flora_user -p flora_db > backup_$(date +%Y%m%d).sql
```

### Q7: 小程序访问后端API失败怎么办？
**A**: 
1. 检查是否在微信公众平台配置了服务器域名（必须是HTTPS）
2. 检查Nginx配置是否正确
3. 检查后端服务是否正常运行（`pm2 status`）
4. 查看后端日志（`pm2 logs flora-server`）

---

## 技术支持

如有任何问题，可以：
1. 查看微信官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/
2. 查看服务器日志：`pm2 logs flora-server`
3. 联系开发者或技术团队

---

**祝你的花店小程序成功上线！** 🌸🌹🌷
