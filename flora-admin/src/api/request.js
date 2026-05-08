// src/api/request.js - axios 配置
import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 请求拦截器 - 添加开发模式header
service.interceptors.request.use(
  config => {
    // 添加开发模式标识
    config.headers['X-Dev-Mode'] = 'true';
    
    // 如果有token也添加
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 200) {
      console.error('API错误:', res.message);
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  error => {
    console.error('响应错误:', error);
    return Promise.reject(error);
  }
);

export default service;
