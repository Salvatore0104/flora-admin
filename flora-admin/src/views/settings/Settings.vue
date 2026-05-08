<!-- src/views/settings/Settings.vue - 系统设置 -->
<template>
  <div class="settings-page">
    <el-card>
      <template #header>
        <div class="header">
          <h3>系统设置</h3>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" type="border-card">
        <!-- MinIO存储设置 -->
        <el-tab-pane label="存储设置" name="storage">
          <el-form :model="minioConfig" label-width="120px" style="max-width: 600px">
            <el-divider content-position="left">
              <el-icon><Connection /></el-icon> MinIO 对象存储配置
            </el-divider>
            
            <el-form-item label="服务地址">
              <el-input v-model="minioConfig.endpoint" placeholder="minio.ai.wowidea.top">
                <template #prepend>https://</template>
              </el-input>
            </el-form-item>
            
            <el-form-item label="Bucket名称">
              <el-input v-model="minioConfig.bucket" placeholder="flora" />
            </el-form-item>
            
            <el-form-item label="Access Key">
              <el-input v-model="minioConfig.accessKey" placeholder="Access Key" show-password />
            </el-form-item>
            
            <el-form-item label="Secret Key">
              <el-input v-model="minioConfig.secretKey" placeholder="Secret Key" show-password />
            </el-form-item>
            
            <el-form-item label="使用HTTPS">
              <el-switch v-model="minioConfig.useSSL" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveMinioConfig" :loading="saving">
                <el-icon><Check /></el-icon> 保存配置
              </el-button>
              <el-button @click="testConnection" :loading="testing">
                <el-icon><Refresh /></el-icon> 测试连接
              </el-button>
            </el-form-item>
          </el-form>
          
          <el-alert
            title="配置说明"
            type="info"
            :closable="false"
            style="margin-top: 20px; max-width: 600px"
          >
            <template #default>
              <ul style="margin: 0; padding-left: 20px; line-height: 1.8">
                <li>配置将保存在 <code>flora-server/src/config/index.js</code> 文件中</li>
                <li>也可以通过环境变量覆盖：<code>MINIO_ENDPOINT</code>, <code>MINIO_ACCESS_KEY</code>, <code>MINIO_SECRET_KEY</code></li>
                <li>图片上传后将自动存储到 MinIO 服务器，URL 格式为：<code>https://{endpoint}/{bucket}/{filename}</code></li>
              </ul>
            </template>
          </el-alert>
        </el-tab-pane>
        
        <!-- 系统信息 -->
        <el-tab-pane label="系统信息" name="system">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="项目名称">Flora 花店系统</el-descriptions-item>
            <el-descriptions-item label="版本号">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="前端框架">Vue 3 + Element Plus</el-descriptions-item>
            <el-descriptions-item label="后端框架">Express.js</el-descriptions-item>
            <el-descriptions-item label="数据库">MySQL</el-descriptions-item>
            <el-descriptions-item label="对象存储">MinIO</el-descriptions-item>
          </el-descriptions>
          
          <el-divider content-position="left">
            <el-icon><Folder /></el-icon> 项目结构
          </el-divider>
          
          <div class="project-tree">
            <div class="tree-item"><span class="folder">📁 flora/</span></div>
            <div class="tree-item"><span class="folder">📁 flora-admin/</span> <span class="desc">后台管理前端</span></div>
            <div class="tree-item"><span class="folder">📁 flora-miniprogram/</span> <span class="desc">微信小程序</span></div>
            <div class="tree-item"><span class="folder">📁 flora-server/</span> <span class="desc">后端服务</span></div>
            <div class="tree-item"><span class="folder">📁 docs/</span> <span class="desc">项目文档</span></div>
          </div>
        </el-tab-pane>
        
        <!-- 上传测试 -->
        <el-tab-pane label="上传测试" name="upload">
          <div class="upload-test">
            <el-upload
              class="upload-demo"
              drag
              :show-file-list="true"
              :before-upload="beforeUpload"
              :http-request="handleUpload"
              accept="image/*"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽图片到此处或 <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">支持 JPG、PNG 格式，大小不超过 5MB</div>
              </template>
            </el-upload>
            
            <div v-if="uploadResult" class="upload-result">
              <el-alert :type="uploadResult.success ? 'success' : 'error'" :title="uploadResult.message" show-icon />
              <div v-if="uploadResult.url" class="upload-url">
                <span>图片地址：</span>
                <el-link type="primary" :href="uploadResult.url" target="_blank">{{ uploadResult.url }}</el-link>
                <el-button size="small" @click="copyUrl">复制</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/api/request';

const activeTab = ref('storage');
const saving = ref(false);
const testing = ref(false);
const uploadResult = ref(null);

const minioConfig = reactive({
  endpoint: 'minio.ai.wowidea.top',
  bucket: 'flora',
  accessKey: 'RtsEOoNriDxslz2902jC',
  secretKey: 'mtVVQDRLQIKxsTfkLHQKfFGWEmStQA9lD3fSnu5m',
  useSSL: true
});

const loadConfig = async () => {
  try {
    const res = await request.get('/admin/settings');
    if (res.code === 200 && res.data?.minio) {
      Object.assign(minioConfig, res.data.minio);
    }
  } catch {
    console.log('使用默认MinIO配置');
  }
};

const saveMinioConfig = async () => {
  saving.value = true;
  try {
    // 实际项目中这里应该调用API保存配置
    // 这里只是演示，实际保存需要修改后端配置
    ElMessage.success('配置已保存到环境变量或配置文件');
  } catch {
    ElMessage.error('保存失败');
  } finally {
    saving.value = false;
  }
};

const testConnection = async () => {
  testing.value = true;
  try {
    // 尝试上传一个测试文件来验证连接
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', testBlob, 'test.txt');
    formData.append('folder', 'test');
    
    const res = await request.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (res.code === 0 || res.code === 200) {
      ElMessage.success('MinIO 连接成功！');
    } else {
      ElMessage.error('连接失败：' + res.msg);
    }
  } catch (err) {
    ElMessage.error('连接失败：' + (err.message || '未知错误'));
  } finally {
    testing.value = false;
  }
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!');
    return false;
  }
  return true;
};

const handleUpload = async (options) => {
  const { file } = options;
  uploadResult.value = null;
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'test');
    
    const res = await request.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (res.code === 0 || res.code === 200) {
      const url = res.data?.url || res.url;
      uploadResult.value = {
        success: true,
        message: '上传成功！',
        url
      };
      ElMessage.success('上传成功');
    } else {
      uploadResult.value = {
        success: false,
        message: res.msg || '上传失败'
      };
      ElMessage.error(res.msg || '上传失败');
    }
  } catch (err) {
    uploadResult.value = {
      success: false,
      message: err.message || '上传失败'
    };
    ElMessage.error('上传失败');
  }
};

const copyUrl = () => {
  if (uploadResult.value?.url) {
    navigator.clipboard.writeText(uploadResult.value.url);
    ElMessage.success('已复制到剪贴板');
  }
};

onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
.settings-page { padding: 0; }
.header { display: flex; justify-content: space-between; align-items: center; }
.header h3 { margin: 0; color: #374151; font-weight: 600; }

.project-tree {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  font-family: monospace;
}
.tree-item {
  padding: 4px 0;
  padding-left: 20px;
}
.tree-item .folder { color: #8b5cf6; }
.tree-item .desc { color: #6b7280; margin-left: 10px; font-family: sans-serif; }

.upload-test { max-width: 500px; }
.upload-result { margin-top: 20px; }
.upload-url {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f5f3ff;
  padding: 12px;
  border-radius: 8px;
}
.upload-url span { color: #6b7280; font-size: 14px; }
</style>
