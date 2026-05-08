# Flora 花店系统 - 修改任务清单

## 项目概述
- 仓库地址: https://github.com/Salvatore0104/flora-admin
- 后端: flora-server (Express)
- 管理后台: flora-admin (Vue3 + Element Plus)
- 小程序: flora-miniprogram (微信小程序)

---

## ✅ 已完成的任务

### 1. 分类管理功能
- [x] 添加后端 `/api/category` 路由 (category.js)
- [x] 支持分类的增删改查操作
- [x] 前端 CategoryList.vue 调用正确的API

### 2. 商品编辑功能
- [x] 修复前端 GoodsEdit.vue 数据加载问题
- [x] 支持从后端正确获取商品信息
- [x] 修复数组解构问题

### 3. MinIO 图片上传
- [x] MinIO 配置正确 (endpoint: minio.ai.wowidea.top, bucket: flora)
- [x] 修复后端 minio.js 配置
- [x] 前端图片上传调用真实API
- [x] 测试上传功能正常

### 4. 仪表盘数据
- [x] 改为从后端获取真实统计数据
- [x] 添加 `/api/admin/stats` API
- [x] 支持今日订单、销售额、库存等数据

### 5. 小程序商品详情
- [x] 修复字段映射 (original_price → originalPrice)
- [x] 添加默认图片处理
- [x] 添加默认保养说明
- [x] goods-detail.js 正确解析API响应

### 6. 数据库查询修复
- [x] 修复内存数据库 db.js 的查询逻辑
- [x] 支持 WHERE 条件查询
- [x] 支持按ID查询商品详情

### 7. GitHub 推送
- [x] 创建仓库 flora-admin
- [x] 推送代码到 main 分支
- [x] .gitignore 排除 node_modules

---

## 🔍 待检查功能清单

### 后端 API
- [ ] 商品列表 API `/api/goods/list`
- [ ] 商品详情 API `/api/goods/detail/:id`
- [ ] 分类列表 API `/api/goods/categories`
- [ ] 图片上传 API `/api/upload`
- [ ] 仪表盘统计 API `/api/admin/stats`
- [ ] 分类管理 API `/api/category/*`

### 管理后台 (flora-admin)
- [ ] 登录功能
- [ ] 商品列表页
- [ ] 商品编辑页 (添加/编辑)
- [ ] 商品图片上传
- [ ] 分类管理页
- [ ] 轮播图管理页
- [ ] 订单管理页
- [ ] 仪表盘统计
- [ ] 系统设置页

### 小程序 (flora-miniprogram)
- [ ] 首页数据加载
- [ ] 分类页数据加载
- [ ] 商品详情页
- [ ] 购物车功能
- [ ] 订单确认页
- [ ] 订单列表页
- [ ] 用户中心

---

## 📝 修改文件列表

### 后端 (flora-server)
```
app.js                          - 添加分类路由、统计API
src/config/index.js             - MinIO配置
src/config/db.js               - 内存数据库修复
src/routes/category.js          - 新增分类路由
src/routes/goods.js             - 商品路由
src/routes/upload.js            - 上传路由
src/utils/minio.js              - MinIO工具修复
```

### 管理后台 (flora-admin)
```
src/views/goods/CategoryList.vue - 修复API调用
src/views/goods/GoodsEdit.vue    - 修复数据加载和上传
src/views/banner/BannerList.vue  - 修复上传功能
src/views/Dashboard.vue          - 真实统计数据
src/views/settings/Settings.vue   - 新增设置页面
src/router/index.js              - 添加设置路由
```

### 小程序 (flora-miniprogram)
```
pages/goods-detail/goods-detail.js - 修复字段映射
utils/api.js                      - API配置
images/default-goods.png          - 新增默认图片
```

---

## 🧪 测试命令

### 启动后端
```bash
cd d:/Github/Flora/flora-server
node app.js
# 服务运行在 http://localhost:3000
```

### 启动管理后台
```bash
cd d:/Github/Flora/flora-admin
npm run dev
# 服务运行在 http://localhost:9528
```

### 测试API
```bash
# 商品详情
curl http://localhost:3000/api/goods/detail/1

# 商品列表
curl http://localhost:3000/api/goods/list

# 分类列表
curl http://localhost:3000/api/goods/categories

# 仪表盘统计
curl http://localhost:3000/api/admin/stats
```

---

## ⚠️ 已知问题

1. **微信开发者工具配置**: 需要在微信开发者工具中勾选"不校验合法域名"
2. **小程序API地址**: 当前配置为 localhost:3000，需要在发布时改为真实服务器地址
3. **数据库**: 当前使用内存数据库，重启后数据会重置

---

## 📅 更新时间
2026-05-08 22:25
