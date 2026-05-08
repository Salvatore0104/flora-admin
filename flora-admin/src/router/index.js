// src/router/index.js - 路由配置
import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/views/Layout.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'goods/list',
        name: 'GoodsList',
        component: () => import('@/views/goods/GoodsList.vue'),
        meta: { title: '商品管理' }
      },
      {
        path: 'goods/category',
        name: 'CategoryList',
        component: () => import('@/views/goods/CategoryList.vue'),
        meta: { title: '分类管理' }
      },
      {
        path: 'goods/add',
        name: 'GoodsAdd',
        component: () => import('@/views/goods/GoodsEdit.vue'),
        meta: { title: '添加商品' }
      },
      {
        path: 'banner/list',
        name: 'BannerList',
        component: () => import('@/views/banner/BannerList.vue'),
        meta: { title: '轮播图管理' }
      },
      {
        path: 'order/list',
        name: 'OrderList',
        component: () => import('@/views/order/OrderList.vue'),
        meta: { title: '订单管理' }
      },
      {
        path: 'user/list',
        name: 'UserList',
        component: () => import('@/views/user/UserList.vue'),
        meta: { title: '会员管理' }
      },
      {
        path: 'marketing/coupon',
        name: 'CouponList',
        component: () => import('@/views/marketing/CouponList.vue'),
        meta: { title: '优惠券管理' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/Settings.vue'),
        meta: { title: '系统设置' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 开发模式下跳过登录
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  const token = localStorage.getItem('token');
  if (to.path !== '/login' && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
