<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">Flora 花店管理后台</h1>
      <el-form :model="form" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import request from '@/api/request';

const router = useRouter();
const loading = ref(false);
const form = ref({
  username: 'admin',
  password: 'admin123'
});

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请输入用户名和密码');
    return;
  }
  
  loading.value = true;
  try {
    const res = await request.post('/admin/login', form.value);
    if (res.code === 200) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('userInfo', JSON.stringify(res.user));
      ElMessage.success('登录成功');
      router.push('/');
    } else {
      ElMessage.error(res.message || '登录失败');
    }
  } catch (err) {
    ElMessage.error('登录失败，请检查服务器');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}
.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}
</style>
