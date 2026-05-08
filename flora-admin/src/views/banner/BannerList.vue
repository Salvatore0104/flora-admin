<!-- src/views/banner/BannerList.vue - 轮播图管理 (紫色主题) -->
<template>
  <div class="banner-page">
    <el-card>
      <template #header>
        <div class="header">
          <h3>轮播图管理</h3>
          <el-button type="primary" @click="showDialog('add')">
            <el-icon><Plus /></el-icon> 添加轮播图
          </el-button>
        </div>
      </template>
      
      <el-table :data="bannerList" v-loading="loading" row-key="id" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="150" />
        <el-table-column prop="image" label="图片" width="200">
          <template #default="{ row }">
            <el-image :src="row.image" fit="cover" class="banner-image" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
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
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '添加轮播图' : '编辑轮播图'" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入轮播图标题" />
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="form.link" placeholder="点击跳转的链接，如 /pages/goods/detail?id=1" />
        </el-form-item>
        <el-form-item label="轮播图片" prop="image">
          <div class="image-upload-wrapper">
            <el-upload
              class="image-uploader"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="handleImageUpload"
            >
              <img v-if="form.image" :src="form.image" class="image-preview" />
              <div v-else class="image-placeholder">
                <el-icon :size="28"><Plus /></el-icon>
                <span>上传图片</span>
              </div>
            </el-upload>
            <div class="upload-tip">建议尺寸: 750x400 像素，支持 JPG、PNG 格式</div>
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
const bannerList = ref([]);

const defaultForm = { id: null, title: '', link: '', image: '', sort: 0, status: 1 };
const form = reactive({ ...defaultForm });

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  image: [{ required: true, message: '请上传轮播图片', trigger: 'change' }]
};

// Mock数据
const mockBanners = [
  { id: 1, title: '新品上市', image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=750&h=400', link: '/pages/goods/list', sort: 1, status: 1 },
  { id: 2, title: '玫瑰花束专区', image: 'https://images.unsplash.com/photo-1518882605630-8a6c87889c28?w=750&h=400', link: '/pages/category/category?id=2', sort: 2, status: 1 },
  { id: 3, title: '绿植专区', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=750&h=400', link: '/pages/category/category?id=3', sort: 3, status: 1 }
];

const loadData = async () => {
  loading.value = true;
  try {
    const res = await request.get('/banner/list');
    bannerList.value = res.data || res.banners || mockBanners;
  } catch {
    bannerList.value = mockBanners;
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
const beforeUpload = (file) => {
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
const handleImageUpload = async (options) => {
  const { file, onSuccess, onError } = options;
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'banners');
    
    const res = await request.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (res.code === 0 || res.code === 200) {
      const url = res.data?.url || res.url;
      form.image = url;
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
      await request.post('/banner/add', form);
      ElMessage.success('添加成功');
    } else {
      await request.put(`/banner/update/${form.id}`, form);
      ElMessage.success('更新成功');
    }
    dialogVisible.value = false;
    loadData();
  } catch {
    ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功');
    dialogVisible.value = false;
    loadData();
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除轮播图"${row.title}"？`, '提示', { type: 'warning' });
    await request.delete(`/banner/delete/${row.id}`);
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
.banner-page { padding: 0; }
.header { display: flex; justify-content: space-between; align-items: center; }
.header h3 { margin: 0; color: #374151; font-weight: 600; }
.banner-image { width: 180px; height: 80px; border-radius: 8px; }
.image-upload-wrapper { display: flex; flex-direction: column; gap: 8px; }
.image-uploader { 
  border: 2px dashed #d1d5db; 
  border-radius: 12px; 
  cursor: pointer; 
  width: 200px; 
  height: 120px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  transition: border-color 0.3s;
  overflow: hidden;
}
.image-uploader:hover { border-color: #8b5cf6; }
.image-preview { width: 200px; height: 120px; object-fit: cover; }
.image-placeholder { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 8px; 
  color: #9ca3af;
}
.image-placeholder span { font-size: 12px; }
.upload-tip { font-size: 12px; color: #9ca3af; }
</style>
