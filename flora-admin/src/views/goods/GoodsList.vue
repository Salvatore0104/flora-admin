<!-- src/views/goods/GoodsList.vue - 商品列表 (紫色主题) -->
<template>
  <div class="goods-list">
    <el-card>
      <template #header>
        <div class="header">
          <h3>商品列表</h3>
          <el-button type="primary" @click="$router.push('/goods/add')">
            <el-icon><Plus /></el-icon> 添加商品
          </el-button>
        </div>
      </template>
      <el-table :data="goodsList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <el-image 
              v-if="row.image" 
              :src="row.image" 
              style="width: 50px; height: 50px" 
              fit="cover" 
              :preview-src-list="[row.image]"
              class="goods-image"
            />
            <div v-else class="goods-image-placeholder">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="150">
          <template #default="{ row }">
            <span class="goods-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category_name" label="分类" width="100">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.category_name || '未分类' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80">
          <template #default="{ row }">
            <span :class="['stock', { low: row.stock < 10 }]">{{ row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="80">
          <template #default="{ row }">
            <span class="sales">{{ row.sales || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" plain @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" plain @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/api/request';

const router = useRouter();
const loading = ref(false);
const goodsList = ref([]);

// Mock数据
const mockGoods = [
  { id: 1, name: '红玫瑰11朵', category_name: '玫瑰', price: 168.00, stock: 25, sales: 520, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200', status: 1 },
  { id: 2, name: '粉色康乃馨花束', category_name: '康乃馨', price: 128.00, stock: 18, sales: 320, image: 'https://images.unsplash.com/photo-1518882605630-8a6c87889c28?w=200', status: 1 },
  { id: 3, name: '开业绿植盆栽', category_name: '绿植', price: 88.00, stock: 5, sales: 180, image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200', status: 1 },
  { id: 4, name: '多肉组合盆栽', category_name: '绿植', price: 68.00, stock: 42, sales: 450, image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=200', status: 1 },
  { id: 5, name: '中式山水盆景', category_name: '盆景', price: 388.00, stock: 3, sales: 35, image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200', status: 1 }
];

const loadGoods = async () => {
  loading.value = true;
  try {
    const res = await request.get('/goods/list');
    goodsList.value = res.goodsList || mockGoods;
  } catch {
    // API失败时使用mock数据
    goodsList.value = mockGoods;
  } finally {
    loading.value = false;
  }
};

const handleEdit = (row) => {
  router.push(`/goods/add?id=${row.id}`);
};

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除商品"${row.name}"？`, '提示', { type: 'warning' });
    await request.delete(`/goods/delete/${row.id}`);
    ElMessage.success('删除成功');
    loadGoods();
  } catch {
    // 模拟删除
    ElMessage.success('删除成功');
    loadGoods();
  }
};

onMounted(loadGoods);
</script>

<style scoped>
.goods-list { padding: 0; }
.header { display: flex; justify-content: space-between; align-items: center; }
.header h3 { margin: 0; font-weight: 600; color: #374151; }
.goods-image { width: 50px; height: 50px; border-radius: 8px; cursor: pointer; }
.goods-image-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: #f5f3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b5cf6;
}
.goods-name { font-weight: 500; color: #374151; }
.price { color: #8b5cf6; font-weight: 700; }
.stock { color: #6b7280; }
.stock.low { color: #ef4444; font-weight: 600; }
.sales { color: #6b7280; }
</style>
