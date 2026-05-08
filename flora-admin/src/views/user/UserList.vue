<!-- src/views/user/UserList.vue - 用户管理 (紫色主题) -->
<template>
  <div class="user-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>会员管理</span>
          <span class="user-count">共 {{ pagination.total }} 位会员</span>
        </div>
      </template>
      
      <!-- 搜索栏 -->
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-input v-model="search.keyword" placeholder="用户名/手机号" clearable>
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadUsers" :loading="loading">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 用户表格 -->
      <el-table :data="userList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="scope">
            <el-avatar :size="40" :src="scope.row.avatarUrl">
              <el-icon :size="20"><User /></el-icon>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column label="积分" width="100">
          <template #default="scope">
            <span class="points">{{ scope.row.points || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="会员等级" width="100">
          <template #default="scope">
            <el-tag size="small" type="warning">{{ scope.row.level || '普通会员' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" plain @click="viewUser(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination 
          v-model:current-page="pagination.page" 
          v-model:page-size="pagination.limit" 
          :total="pagination.total" 
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @current-change="loadUsers"
          @size-change="loadUsers"
        />
      </div>
    </el-card>

    <!-- 用户详情弹窗 -->
    <el-dialog v-model="detailVisible" title="会员详情" width="600px">
      <div v-if="currentUser" class="user-detail">
        <div class="user-header">
          <el-avatar :size="80" :src="currentUser.avatarUrl">
            <el-icon :size="40"><User /></el-icon>
          </el-avatar>
          <div class="user-info">
            <h3>{{ currentUser.nickname || '未设置昵称' }}</h3>
            <p>手机号：{{ currentUser.phone || '未绑定' }}</p>
          </div>
        </div>
        <el-descriptions :column="2" border style="margin-top: 20px;">
          <el-descriptions-item label="会员ID">{{ currentUser.id }}</el-descriptions-item>
          <el-descriptions-item label="会员等级">{{ currentUser.level || '普通会员' }}</el-descriptions-item>
          <el-descriptions-item label="积分余额">{{ currentUser.points || 0 }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ currentUser.createTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/api/request';

const loading = ref(false);
const detailVisible = ref(false);
const currentUser = ref(null);

const userList = ref([]);
const search = ref({ keyword: '' });
const pagination = reactive({ page: 1, limit: 10, total: 0 });

// Mock数据
const mockUsers = [
  { id: 1, nickname: '花语心声', phone: '138****1234', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', points: 520, level: '黄金会员', createTime: '2024-01-01 10:00:00' },
  { id: 2, nickname: '花香满屋', phone: '139****5678', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', points: 320, level: '白银会员', createTime: '2024-01-02 14:30:00' },
  { id: 3, nickname: '花之语', phone: '137****9012', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', points: 180, level: '普通会员', createTime: '2024-01-03 09:15:00' },
  { id: 4, nickname: '花语蝶舞', phone: '136****3456', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', points: 890, level: '钻石会员', createTime: '2024-01-04 16:45:00' },
  { id: 5, nickname: '花落花开', phone: '135****7890', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', points: 45, level: '普通会员', createTime: '2024-01-05 11:20:00' }
];

const loadUsers = async () => {
  loading.value = true;
  try {
    const res = await request.get('/user/list', {
      params: { 
        keyword: search.value.keyword,
        page: pagination.page,
        limit: pagination.limit
      }
    });
    userList.value = res.users || mockUsers;
    pagination.total = res.total || mockUsers.length;
  } catch {
    // API失败时使用mock数据
    userList.value = mockUsers;
    pagination.total = mockUsers.length;
  } finally {
    loading.value = false;
  }
};

const viewUser = (row) => {
  currentUser.value = row;
  detailVisible.value = true;
};

onMounted(loadUsers);
</script>

<style scoped>
.user-list { padding: 0; }
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user-count {
  font-size: 14px;
  color: #8b5cf6;
  font-weight: 500;
}
.search-form {
  margin-bottom: 16px;
}
.points {
  color: #8b5cf6;
  font-weight: 600;
}
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.user-detail {
  padding: 10px 0;
}
.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
}
.user-info h3 {
  margin: 0 0 8px 0;
  color: #374151;
}
.user-info p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}
</style>
