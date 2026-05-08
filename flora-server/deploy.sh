#!/bin/bash
# Flora 花店小程序 - 阿里云一键部署脚本

echo "========================================="
echo "  Flora 阿里云部署脚本"
echo "========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}请使用 sudo 运行此脚本${NC}"
   exit 1
fi

echo -e "${GREEN}[1/7] 更新系统...${NC}"
apt update && apt upgrade -y

echo -e "${GREEN}[2/7] 安装 Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node -v

echo -e "${GREEN}[3/7] 安装 MySQL...${NC}"
apt install -y mysql-server
mysql_secure_installation

echo -e "${GREEN}[4/7] 安装 Nginx...${NC}"
apt install -y nginx

echo -e "${GREEN}[5/7] 安装 PM2...${NC}"
npm install -g pm2

echo -e "${GREEN}[6/7] 配置 MySQL 数据库...${NC}"
read -p "请输入数据库密码: " DB_PASSWORD

mysql -e "CREATE DATABASE IF NOT EXISTS flora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS 'flora'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
mysql -e "GRANT ALL PRIVILEGES ON flora_db.* TO 'flora'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

echo -e "${GREEN}[7/7] 安装后端依赖...${NC}"
cd /var/www/flora/flora-server
npm install --production

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}基础环境安装完成！${NC}"
echo ""
echo "下一步："
echo "1. 配置 .env 文件（参考 docs/deployment.md）"
echo "2. 初始化数据库表"
echo "3. 配置 Nginx"
echo "4. 启动服务: pm2 start app.js --name flora-server"
echo "========================================="
