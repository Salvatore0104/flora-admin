<!-- src/views/Dashboard.vue - 仪表盘 (紫色主题配色 - 真实数据) -->
<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.title">
        <div class="stat-icon" :style="{ background: stat.bgColor }">
          <el-icon :size="24" :style="{ color: stat.color }"><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-title">{{ stat.title }}</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-row">
      <el-card class="chart-card">
        <template #header><span>销售趋势（近7天）</span></template>
        <div class="chart-area">
          <div v-if="salesData.length > 0" class="bar-chart">
            <div v-for="(item, i) in salesData" :key="i" class="bar-item">
              <div class="bar-wrapper">
                <div class="bar" :style="{ height: getBarHeight(item.count) + '%', background: colors[i % colors.length] }"></div>
              </div>
              <span class="bar-label">{{ formatDate(item.date) }}</span>
              <span class="bar-value">¥{{ item.sales || 0 }}</span>
            </div>
          </div>
          <div v-else class="no-data">
            <el-empty description="暂无销售数据" :image-size="80" />
          </div>
        </div>
      </el-card>

      <el-card class="chart-card">
        <template #header><span>商品分类占比</span></template>
        <div class="chart-area">
          <div v-if="categoryData.length > 0" class="pie-chart">
            <div class="pie-ring" :style="getPieGradient"></div>
            <div class="pie-legend">
              <div v-for="(item, i) in categoryData" :key="i" class="legend-item">
                <span class="legend-dot" :style="{ background: colors[i % colors.length] }"></span>
                <span class="legend-label">{{ item.label }}</span>
                <span class="legend-value">{{ item.value }}%</span>
              </div>
            </div>
          </div>
          <div v-else class="no-data">
            <el-empty description="暂无分类数据" :image-size="80" />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 热门商品 -->
    <el-card class="hot-goods">
      <template #header>
        <span>热门商品 TOP5</span>
      </template>
      <el-table v-if="hotGoods.length > 0" :data="hotGoods" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">¥{{ row.price }}</template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="暂无热门商品" />
    </el-card>

    <!-- 待处理事项 -->
    <div class="todo-section">
      <el-card>
        <template #header><span>待处理事项</span></template>
        <div class="todo-list">
          <div class="todo-item" v-for="item in todos" :key="item.title">
            <el-icon :size="20" :style="{ color: '#8b5cf6' }"><component :is="item.icon" /></el-icon>
            <span class="todo-title">{{ item.title }}</span>
            <el-badge :value="item.count" :type="item.count > 0 ? 'danger' : 'info'" />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import request from '@/api/request';

const stats = ref([
  { title: '今日订单', value: '-', icon: 'ShoppingCart', color: '#8b5cf6', bgColor: '#f5f3ff' },
  { title: '今日销售额', value: '-', icon: 'Money', color: '#16a34a', bgColor: '#dcfce7' },
  { title: '商品总数', value: '-', icon: 'Goods', color: '#2563eb', bgColor: '#dbeafe' },
  { title: '会员总数', value: '-', icon: 'User', color: '#d97706', bgColor: '#fef3c7' }
]);

const salesData = ref([]);
const categoryData = ref([]);
const hotGoods = ref([]);
const todos = ref([
  { title: '待发货订单', count: 0, icon: 'Box' },
  { title: '待处理售后', count: 0, icon: 'Warning' },
  { title: '库存不足', count: 0, icon: 'Remove' }
]);

const colors = ['#8b5cf6', '#16a34a', '#2563eb', '#d97706', '#6b7280'];

// 计算饼图渐变
const getPieGradient = computed(() => {
  if (categoryData.value.length === 0) return {};
  
  let currentDeg = 0;
  const gradients = categoryData.value.map((item, i) => {
    const nextDeg = currentDeg + (item.value / 100) * 360;
    const color = colors[i % colors.length];
    const gradient = `${color} ${currentDeg}deg ${nextDeg}deg`;
    currentDeg = nextDeg;
    return gradient;
  });
  
  return {
    background: `conic-gradient(${gradients.join(', ')})`
  };
});

// 格式化日期
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}/${day}`;
};

// 获取柱状图高度百分比
const getBarHeight = (count) => {
  if (!count || salesData.value.length === 0) return 10;
  const max = Math.max(...salesData.value.map(s => s.count || 0));
  return max > 0 ? Math.max((count / max) * 100, 10) : 10;
};

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await request.get('/admin/stats');
    if (res.code === 200 && res.data) {
      const { stats: s, todos: t, salesTrend, categoryStats, hotGoods: h } = res.data;
      
      stats.value = [
        { title: '今日订单', value: s.todayOrders || 0, icon: 'ShoppingCart', color: '#8b5cf6', bgColor: '#f5f3ff' },
        { title: '今日销售额', value: `¥${(s.todaySales || 0).toLocaleString()}`, icon: 'Money', color: '#16a34a', bgColor: '#dcfce7' },
        { title: '商品总数', value: s.goodsCount || 0, icon: 'Goods', color: '#2563eb', bgColor: '#dbeafe' },
        { title: '会员总数', value: (s.userCount || 0).toLocaleString(), icon: 'User', color: '#d97706', bgColor: '#fef3c7' }
      ];
      
      todos.value = [
        { title: '待发货订单', count: t.pendingOrders || 0, icon: 'Box' },
        { title: '待处理售后', count: t.afterSales || 0, icon: 'Warning' },
        { title: '库存不足', count: t.lowStock || 0, icon: 'Remove' }
      ];
      
      salesData.value = salesTrend || [];
      categoryData.value = categoryStats || [];
      hotGoods.value = h || [];
    }
  } catch (err) {
    console.error('获取统计数据失败:', err);
  }
};

onMounted(loadStats);
</script>

<style scoped>
.dashboard { max-width: 1400px; margin: 0 auto; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.06);
  border: 1px solid #e9d5ff;
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-value { font-size: 26px; font-weight: 700; color: #1f2937; }
.stat-title { font-size: 14px; color: #6b7280; margin-top: 4px; }

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.chart-card :deep(.el-card__header) { 
  background: #faf8ff; 
  border-bottom: 1px solid #e9d5ff;
  font-weight: 600;
  color: #374151;
  padding: 16px 20px;
}

.chart-area { padding: 20px 0; min-height: 240px; }
.no-data { display: flex; align-items: center; justify-content: center; height: 200px; }

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding: 0 20px;
}

.bar-item { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 8px; 
  flex: 1;
}

.bar-wrapper {
  height: 160px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar {
  width: 36px;
  border-radius: 6px 6px 0 0;
  transition: height 0.5s ease;
  min-height: 8px;
}
.bar-label { font-size: 13px; color: #6b7280; font-weight: 500; }
.bar-value { font-size: 12px; color: #8b5cf6; font-weight: 600; }

.pie-chart { 
  display: flex; 
  align-items: center; 
  gap: 40px;
  justify-content: center;
}

.pie-ring {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}
.pie-ring::after {
  content: '';
  width: 80px;
  height: 80px;
  background: #fff;
  border-radius: 50%;
}

.pie-legend { display: flex; flex-direction: column; gap: 12px; }
.legend-item { display: flex; align-items: center; gap: 10px; }
.legend-dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
.legend-label { font-size: 14px; color: #4b5563; }
.legend-value { font-size: 14px; color: #8b5cf6; font-weight: 600; margin-left: auto; }

.hot-goods, .todo-section { margin-bottom: 24px; }
.hot-goods :deep(.el-card__header) { 
  background: #faf8ff; 
  border-bottom: 1px solid #e9d5ff; 
  font-weight: 600; 
  color: #374151;
  padding: 16px 20px;
}

.todo-list { display: flex; gap: 16px; }
.todo-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f5f3ff;
  border-radius: 10px;
  border: 1px solid #e9d5ff;
}
.todo-title { 
  flex: 1; 
  color: #4b5563;
  font-size: 14px;
}
</style>
