-- Flora 花店数据库初始化脚本

USE flora;

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(50),
  `avatar` VARCHAR(255),
  `phone` VARCHAR(20),
  `email` VARCHAR(100),
  `balance` DECIMAL(10,2) DEFAULT 0.00,
  `points` INT DEFAULT 0,
  `member_level` TINYINT DEFAULT 1 COMMENT '1普通 2银卡 3金卡 4钻石',
  `status` TINYINT DEFAULT 1 COMMENT '1正常 0禁用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `icon` VARCHAR(255),
  `sort` INT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE IF NOT EXISTS `goods` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `category_id` INT,
  `price` DECIMAL(10,2) NOT NULL,
  `original_price` DECIMAL(10,2),
  `stock` INT DEFAULT 0,
  `sales` INT DEFAULT 0,
  `image` VARCHAR(255),
  `images` TEXT COMMENT 'JSON数组',
  `description` TEXT,
  `content` TEXT,
  `is_hot` TINYINT DEFAULT 0,
  `is_new` TINYINT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
);

-- 轮播图表
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(100),
  `image` VARCHAR(255) NOT NULL,
  `link` VARCHAR(255),
  `type` TINYINT DEFAULT 1 COMMENT '1商品 2分类 3链接',
  `target_id` INT,
  `sort` INT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 优惠券表
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `type` TINYINT DEFAULT 1 COMMENT '1满减券 2折扣券',
  `value` DECIMAL(10,2) NOT NULL COMMENT '优惠金额或折扣',
  `min_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '满多少可用',
  `total` INT NOT NULL,
  `remain` INT NOT NULL,
  `start_time` DATETIME,
  `end_time` DATETIME,
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户优惠券表
CREATE TABLE IF NOT EXISTS `user_coupons` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT,
  `coupon_id` INT,
  `status` TINYINT DEFAULT 0 COMMENT '0未使用 1已使用 2已过期',
  `used_at` DATETIME,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`)
);

-- 订单表
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `order_no` VARCHAR(50) UNIQUE NOT NULL,
  `user_id` INT,
  `total_price` DECIMAL(10,2) NOT NULL,
  `freight` DECIMAL(10,2) DEFAULT 0,
  `discount` DECIMAL(10,2) DEFAULT 0,
  `pay_price` DECIMAL(10,2) NOT NULL,
  `pay_type` TINYINT COMMENT '1微信 2支付宝',
  `pay_status` TINYINT DEFAULT 0 COMMENT '0未支付 1已支付 2已退款',
  `pay_time` DATETIME,
  `status` TINYINT DEFAULT 0 COMMENT '0待支付 1待发货 2待收货 3已完成 4已取消',
  `receiver_name` VARCHAR(50),
  `receiver_phone` VARCHAR(20),
  `receiver_address` VARCHAR(255),
  `remark` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- 订单商品表
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `order_id` INT,
  `goods_id` INT,
  `goods_name` VARCHAR(100),
  `goods_image` VARCHAR(255),
  `price` DECIMAL(10,2),
  `quantity` INT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  FOREIGN KEY (`goods_id`) REFERENCES `goods`(`id`)
);

-- 收货地址表
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT,
  `name` VARCHAR(50),
  `phone` VARCHAR(20),
  `province` VARCHAR(50),
  `city` VARCHAR(50),
  `district` VARCHAR(50),
  `address` VARCHAR(255),
  `is_default` TINYINT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- 管理员表
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(50),
  `avatar` VARCHAR(255),
  `role` VARCHAR(20) DEFAULT 'admin',
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入默认管理员
INSERT INTO `admins` (`username`, `password`, `nickname`, `role`) VALUES 
('admin', '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', '超级管理员', 'super'),
('admin2', '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', '运营管理员', 'admin');

-- 插入示例分类
INSERT INTO `categories` (`name`, `icon`, `sort`) VALUES 
('鲜花', 'flower', 1),
('绿植', 'plant', 2),
('盆景', 'bonsai', 3),
('花束', 'bouquet', 4),
('花篮', 'basket', 5);

-- 插入示例商品
INSERT INTO `goods` (`name`, `category_id`, `price`, `original_price`, `stock`, `sales`, `image`, `is_hot`, `is_new`) VALUES
('红玫瑰11朵', 1, 168.00, 198.00, 100, 520, '/uploads/goods/rose.jpg', 1, 0),
('粉色康乃馨', 1, 128.00, 158.00, 80, 320, '/uploads/goods/carnation.jpg', 0, 1),
('开业绿植盆栽', 2, 88.00, 108.00, 60, 180, '/uploads/goods/plant.jpg', 1, 0),
('多肉组合盆栽', 2, 68.00, 88.00, 120, 450, '/uploads/goods/succulent.jpg', 0, 1),
('中式山水盆景', 3, 388.00, 488.00, 20, 35, '/uploads/goods/bonsai.jpg', 0, 0);

-- 插入示例轮播图
INSERT INTO `banners` (`title`, `image`, `link`, `type`, `sort`) VALUES
('母亲节特惠', '/uploads/banner/banner1.jpg', '', 1, 1),
('新品上市', '/uploads/banner/banner2.jpg', '', 1, 2),
('会员专享', '/uploads/banner/banner3.jpg', '', 1, 3);

-- 插入示例优惠券
INSERT INTO `coupons` (`name`, `type`, `value`, `min_amount`, `total`, `remain`, `start_time`, `end_time`) VALUES
('新人专享券', 1, 20.00, 100.00, 1000, 850, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('满减优惠券', 1, 50.00, 300.00, 500, 420, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY)),
('95折折扣券', 2, 0.95, 0.00, 200, 180, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));
