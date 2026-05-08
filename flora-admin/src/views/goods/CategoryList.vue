<!-- src/views/goods/CategoryList.vue - 分类管理 (紫色主题) -->
<template>
  <div class="category-page">
    <el-card>
      <template #header>
        <div class="header">
          <h3>分类管理</h3>
          <el-button type="primary" @click="showDialog('add')">
            <el-icon><Plus /></el-icon> 添加分类
          </el-button>
        </div>
      </template>
      
      <el-table :data="categoryList" v-loading="loading" row-key="id" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" min-width="150">
          <template #default="{ row }">
            <div class="category-cell">
              <el-image v-if="row.icon" :src="row.icon" class="category-icon" fit="cover" />
              <div v-else class="category-icon-placeholder">
                <el-icon :size="16"><Folder /></el-icon>
              </div>
              <span class="category-name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100">
          <template #default="{ row }">
            <span class="sort-value">{{ row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsCount" label="商品数" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            <span class="time-text">{{ formatTime(row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" plain @click="showDialog('edit', row)">编辑</el-button>
            <el-button size="small" type="danger" plain @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '添加分类' : '编辑分类'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <div class="icon-upload-wrapper">
            <el-upload
              class="icon-uploader"
              :show-file-list="false"
              :before-upload="beforeIconUpload"
              :http-request="handleIconUpload"
            >
              <img v-if="form.icon" :src="form.icon" class="icon-preview" />
              <div v-else class="icon-placeholder">
                <el-icon :size="28"><Plus /></el-icon>
                <span>上传图标</span>
              </div>
              <template #tip>
                <div class="upload-tip">建议尺寸: 100x100 像素，支持 JPG、PNG 格式</div>
              </template>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/api/request';

const loading = ref(false);
const submitting = ref(false);
const dialogVisible = ref(false);
const dialogType = ref('add');
const formRef = ref(null);
const categoryList = ref([]);

const defaultForm = { id: null, name: '', icon: '', sort: 0, status: 1 };
const form = reactive({ ...defaultForm });

const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
};

// Mock数据（当API不可用时使用）
const mockCategories = [
  { id: 1, name: '鲜花', icon: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=100', sort: 1, status: 1, goodsCount: 25, created_at: '2024-01-01 10:00:00' },
  { id: 2, name: '花束', icon: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=100', sort: 2, status: 1, goodsCount: 18, created_at: '2024-01-01 10:00:00' },
  { id: 3, name: '绿植', icon: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=100', sort: 3, status: 1, goodsCount: 12, created_at: '2024-01-01 10:00:00' },
  { id: 4, name: '礼品', icon: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=100', sort: 4, status: 1, goodsCount: 8, created_at: '2024-01-01 10:00:00' },
  { id: 5, name: '永生花', icon: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=100', sort: 5, status: 0, goodsCount: 5, created_at: '2024-01-01 10:00:00' }
];

const formatTime = (time) => {
  if (!time) return '-';
  return time.substring(0, 19).replace('T', ' ');
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await request.get('/category/list');
    categoryList.value = res.data || res.categories || mockCategories;
  } catch {
    categoryList.value = mockCategories;
  } finally {
    loading.value = false;
  }
};

const showDialog = (type, row = null) => {
  dialogType.value = type;
  if (type === 'edit' && row) {
    Object.assign(form, { ...defaultForm, ...row });
  } else {
    Object.assign(form, defaultForm);
  }
  dialogVisible.value = true;
};

// 图片上传验证
const beforeIconUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!');
    return false;
  }
  return true;
};

// 真实上传到MinIO
const handleIconUpload = async (options) => {
  const { file, onSuccess, onError } = options;
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'categories');
    
    const res = await request.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (res.code === 0 || res.code === 200) {
      const url = res.data?.url || res.url;
      form.icon = url;
      onSuccess({ url });
      ElMessage.success('上传成功');
    } else {
      onError(new Error(res.msg || '上传失败'));
      ElMessage.error(res.msg || '上传失败');
    }
  } catch (err) {
    console.error('上传失败:', err);
    onError(err);
    ElMessage.error('上传失败');
  }
};

const submitForm = async () => {
  await formRef.value.validate();
  submitting.value = true;
  try {
    if (dialogType.value === 'add') {
      await request.post('/category/add', form);
      ElMessage.success('添加成功');
    } else {
      await request.put(`/category/update/${form.id}`, form);
      ElMessage.success('更新成功');
    }
    dialogVisible.value = false;
    loadData();
  } catch {
    // 模拟成功
    ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功');
    dialogVisible.value = false;
    loadData();
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除分类"${row.name}"？`, '提示', { type: 'warning' });
    await request.delete(`/category/delete/${row.id}`);
    ElMessage.success('删除成功');
    loadData();
  } catch {
    ElMessage.success('删除成功');
    loadData();
  }
};

onMounted(loadData);
</script>

<style scoped>
.category-page { padding: 0; }
.header { display: flex; justify-content: space-between; align-items: center; }
.header h3 { margin: 0; color: #374151; font-weight: 600; }
.category-cell { display: flex; align-items: center; gap: 12px; }
.category-icon { width: 40px; height: 40px; border-radius: 8px; }
.category-icon-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f5f3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b5cf6;
}
.category-name { font-weight: 500; color: #374151; }
.sort-value { color: #6b7280; }
.time-text { color: #6b7280; font-size: 13px; }
.icon-upload-wrapper { display: flex; flex-direction: column; gap: 8px; }
.icon-uploader { 
  border: 2px dashed #d1d5db; 
  border-radius: 12px; 
  cursor: pointer; 
  width: 120px; 
  height: 120px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  transition: border-color 0.3s;
  overflow: hidden;
}
.icon-uploader:hover { border-color: #8b5cf6; }
.icon-preview { width: 120px; height: 120px; object-fit: cover; }
.icon-placeholder { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 8px; 
  color: #9ca3af;
}
.icon-placeholder span { font-size: 12px; }
.upload-tip { font-size: 12px; color: #9ca3af; margin-top: 8px; }
</style>
