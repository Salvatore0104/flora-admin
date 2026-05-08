<!-- src/views/Layout.vue - 后台管理布局 (紫色主题配色) -->
<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="sidebar">
      <div class="logo">
        <el-icon :size="24"><Shop /></el-icon>
        <h2>Flora Admin</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#8b5cf6"
        text-color="#ffffff"
        active-text-color="#fef3c7"
        :collapse="false"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        
        <el-sub-menu index="goods">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/goods/list">商品列表</el-menu-item>
          <el-menu-item index="/goods/category">分类管理</el-menu-item>
          <el-menu-item index="/goods/add">添加商品</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="order">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>订单管理</span>
          </template>
          <el-menu-item index="/order/list">订单列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="marketing">
          <template #title>
            <el-icon><Tickets /></el-icon>
            <span>营销管理</span>
          </template>
          <el-menu-item index="/banner/list">轮播图管理</el-menu-item>
          <el-menu-item index="/marketing/coupon">优惠券</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/user/list">
          <el-icon><User /></el-icon>
          <span>会员管理</span>
        </el-menu-item>

        <el-divider style="border-color: rgba(255,255,255,0.2); margin: 12px 0;" />
        
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <h3>{{ currentTitle }}</h3>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" style="background: #8b5cf6; color: #fff;">管</el-avatar>
              <span class="user-name">管理员</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const activeMenu = computed(() => route.path);
const currentTitle = computed(() => route.meta.title || '仪表盘');

const handleCommand = (command) => {
  if (command === 'logout') {
    localStorage.removeItem('token');
    router.push('/login');
  }
};
</script>

<style scoped>
.layout { height: 100vh; }
.sidebar { background-color: #8b5cf6; overflow-x: hidden; }
.logo { 
  display: flex; 
  align-items: center; 
  gap: 10px;
  justify-content: center;
  padding: 20px 10px;
  color: #fff;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}
.logo h2 { margin: 0; font-size: 18px; color: #fff; letter-spacing: 1px; }
.header { 
  background-color: white; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
  padding: 0 24px;
}
.header-left h3 { margin: 0; color: #374151; font-weight: 600; }
.header-right { display: flex; align-items: center; gap: 20px; }
.user-info { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.3s;
}
.user-info:hover { background: #f5f3ff; }
.user-name { font-size: 14px; color: #4b5563; font-weight: 500; }
.main-content { 
  background: #f5f3ff; 
  padding: 24px;
  overflow-y: auto;
}
::v-deep(.el-menu-item), ::v-deep(.el-sub-menu__title) { height: 50px; line-height: 50px; }
::v-deep(.el-menu-item.is-active) { background: #7c3aed !important; }
::v-deep(.el-menu-item:hover) { background: #7c3aed !important; color: #fff !important; }
::v-deep(.el-sub-menu__title:hover) { background: #7c3aed !important; color: #fff !important; }
</style>
