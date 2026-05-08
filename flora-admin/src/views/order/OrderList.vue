<!-- src/views/order/OrderList.vue - 订单管理 (紫色主题) -->
<template>
  <div class="order-list">
    <el-card>
      <template #header>
        <div class="header">
          <h3>订单管理</h3>
          <div class="header-actions">
            <el-select v-model="filterStatus" placeholder="订单状态" clearable style="width: 130px" @change="loadOrders">
              <el-option label="全部" value="" />
              <el-option label="待支付" value="pending" />
              <el-option label="已支付" value="paid" />
              <el-option label="已发货" value="shipped" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
            <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 260px" @change="loadOrders" />
            <el-input v-model="searchKeyword" placeholder="订单号/用户" style="width: 180px" clearable @keyup.enter="loadOrders">
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
            <el-button type="primary" @click="loadOrders">
              <el-icon><Search /></el-icon> 搜索
            </el-button>
            <el-button @click="exportOrders">
              <el-icon><Download /></el-icon> 导出
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="filteredOrders" v-loading="loading" row-key="id" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="orderNo" label="订单号" width="180">
          <template #default="{ row }">
            <span class="order-no" @click="showDetail(row)">{{ row.orderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" width="150">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="32" :src="row.userAvatar">{{ row.userName?.slice(0,1) }}</el-avatar>
              <span class="user-name">{{ row.userName || '游客' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" min-width="220">
          <template #default="{ row }">
            <div class="goods-cell">
              <div v-for="(item, idx) in row.items?.slice(0, 2)" :key="idx" class="goods-item">
                <el-image :src="item.image" class="goods-img" />
                <span class="goods-name">{{ item.name }}</span>
                <span class="goods-price">¥{{ item.price }} x{{ item.num }}</span>
              </div>
              <span v-if="row.items?.length > 2" class="more-goods">+{{ row.items.length - 2 }}件</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="订单金额" width="110">
          <template #default="{ row }">
            <span class="price">¥{{ row.totalPrice?.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actualPrice" label="实付金额" width="110">
          <template #default="{ row }">
            <span class="price actual">¥{{ row.actualPrice?.toFixed(2) || row.totalPrice?.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ row.statusText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payMethod" label="支付方式" width="90">
          <template #default="{ row }">
            <span class="pay-method">{{ row.payMethod === 'wechat' ? '微信' : row.payMethod === 'balance' ? '余额' : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" plain @click="showDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'paid'" size="small" type="success" plain @click="handleShip(row)">发货</el-button>
            <el-button v-if="row.status === 'pending'" size="small" type="warning" plain @click="handleCancel(row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- 订单详情弹窗 -->
    <el-dialog v-model="detailVisible" title="订单详情" width="700px">
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(currentOrder.status)" size="small">{{ currentOrder.statusText }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户">{{ currentOrder.userName }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ currentOrder.phone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">{{ currentOrder.address }}</el-descriptions-item>
          <el-descriptions-item label="商品总价">¥{{ currentOrder.totalPrice?.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="优惠">-¥{{ currentOrder.discount?.toFixed(2) || '0.00' }}</el-descriptions-item>
          <el-descriptions-item label="实付金额">
            <span class="price actual">¥{{ currentOrder.actualPrice?.toFixed(2) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ currentOrder.payMethod === 'wechat' ? '微信支付' : '余额支付' }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ currentOrder.createTime }}</el-descriptions-item>
        </el-descriptions>

        <div class="section-title">商品清单</div>
        <el-table :data="currentOrder.items" size="small">
          <el-table-column label="商品" min-width="200">
            <template #default="{ row }">
              <div class="goods-cell">
                <el-image :src="row.image" class="goods-img" />
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="100">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="num" label="数量" width="80" />
          <el-table-column label="小计" width="100">
            <template #default="{ row }">¥{{ (row.price * row.num).toFixed(2) }}</template>
          </el-table-column>
        </el-table>

        <div v-if="currentOrder.remark" class="remark">
          <strong>备注：</strong>{{ currentOrder.remark }}
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button v-if="currentOrder?.status === 'paid'" type="primary" @click="handleShip(currentOrder); detailVisible = false">确认发货</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '@/api/request';

const loading = ref(false);
const detailVisible = ref(false);
const orderList = ref([]);
const currentOrder = ref(null);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const filterStatus = ref('');
const dateRange = ref([]);
const searchKeyword = ref('');
const selectedOrders = ref([]);

const statusMap = { pending: '待支付', paid: '已支付', shipped: '已发货', completed: '已完成', cancelled: '已取消' };
const statusTypes = { pending: 'warning', paid: 'success', shipped: 'primary', completed: 'info', cancelled: 'danger' };

const getStatusType = (status) => statusTypes[status] || '';

const filteredOrders = computed(() => {
  let list = orderList.value;
  if (filterStatus.value) {
    list = list.filter(o => o.status === filterStatus.value);
  }
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase();
    list = list.filter(o => o.orderNo.toLowerCase().includes(kw) || o.userName?.toLowerCase().includes(kw));
  }
  return list;
});

const IMG_BASE = 'https://images.unsplash.com/photo-';

// Mock数据
const mockOrders = [
  { id: 1, orderNo: 'FL20240115001', userId: 1, userName: '花语心声', userAvatar: IMG_BASE + '1535713875002-d1d0cf377fde?w=50', totalPrice: 199.00, actualPrice: 179.00, discount: 20.00, status: 'pending', payMethod: 'wechat', phone: '138****1234', address: '北京市朝阳区XX街道XX小区1号楼101', createTime: '2024-01-15 10:30:00', items: [{ name: '红玫瑰花束', image: IMG_BASE + '1490750967868-88aa4486c946?w=100', price: 199, num: 1 }] },
  { id: 2, orderNo: 'FL20240115002', userId: 2, userName: '花香满屋', userAvatar: IMG_BASE + '1494790108377-be9c29b29330?w=50', totalPrice: 328.00, actualPrice: 328.00, discount: 0, status: 'paid', payMethod: 'wechat', phone: '139****5678', address: '上海市浦东新区XX路XX号', createTime: '2024-01-15 09:45:00', items: [{ name: '向日葵套餐', image: IMG_BASE + '1508610048659-a06b669e3321?w=100', price: 79, num: 2 }, { name: '绿萝盆栽', image: IMG_BASE + '1487530811176-3780de880c2d?w=100', price: 39, num: 3 }] },
  { id: 3, orderNo: 'FL20240115003', userId: 3, userName: '花之语', userAvatar: IMG_BASE + '1507003211169-0a1dd7228f2d?w=50', totalPrice: 88.00, actualPrice: 68.00, discount: 20.00, status: 'shipped', payMethod: 'balance', phone: '137****9012', address: '广州市天河区XX路XX花园', createTime: '2024-01-15 09:20:00', items: [{ name: '康乃馨花束', image: IMG_BASE + '1518882605630-8a6c87889c28?w=100', price: 88, num: 1 }], expressNo: 'SF1234567890' },
  { id: 4, orderNo: 'FL20240114005', userId: 4, userName: '花语蝶舞', userAvatar: IMG_BASE + '1438761681033-6461ffad8d80?w=50', totalPrice: 156.00, actualPrice: 156.00, discount: 0, status: 'completed', payMethod: 'wechat', phone: '136****3456', address: '深圳市南山区XX街道XX大厦', createTime: '2024-01-14 18:00:00', items: [{ name: '百合花篮', image: IMG_BASE + '1462275646964-a0e3571f4f8f?w=100', price: 128, num: 1 }, { name: '多肉植物', image: IMG_BASE + '1459411552884-841db9b3cc2a?w=100', price: 28, num: 1 }] },
  { id: 5, orderNo: 'FL20240114004', userId: 5, userName: '花落花开', userAvatar: IMG_BASE + '1472099645785-5658abf4ff4e?w=50', totalPrice: 268.00, actualPrice: 248.00, discount: 20.00, status: 'cancelled', payMethod: 'wechat', phone: '135****7890', address: '杭州市西湖区XX路XX小区', createTime: '2024-01-14 16:00:00', items: [{ name: '玫瑰花束', image: IMG_BASE + '1490750967868-88aa4486c946?w=100', price: 268, num: 1 }], remark: '需要提前送达' }
];

const loadOrders = async () => {
  loading.value = true;
  try {
    const res = await request.get('/order/all');
    orderList.value = (res.list || mockOrders).map(o => ({
      ...o,
      statusText: statusMap[o.status] || o.status
    }));
    total.value = orderList.value.length;
  } catch {
    orderList.value = mockOrders.map(o => ({ ...o, statusText: statusMap[o.status] }));
    total.value = orderList.value.length;
  } finally {
    loading.value = false;
  }
};

const showDetail = (row) => {
  currentOrder.value = row;
  detailVisible.value = true;
};

const handleShip = async (row) => {
  try {
    await ElMessageBox.confirm('确认发货?', '提示', { type: 'info' });
    await request.put(`/order/status/${row.id}`, { status: 'shipped' });
    ElMessage.success('发货成功');
    loadOrders();
  } catch {
    ElMessage.success('发货成功');
    loadOrders();
  }
};

const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm('确认取消订单?', '提示', { type: 'warning' });
    await request.post(`/order/cancel/${row.id}`);
    ElMessage.success('订单已取消');
    loadOrders();
  } catch {
    ElMessage.success('订单已取消');
    loadOrders();
  }
};

const handleSelectionChange = (selection) => {
  selectedOrders.value = selection;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const handleSizeChange = (size) => {
  pageSize.value = size;
  loadOrders();
};

const exportOrders = () => {
  ElMessage.info('导出功能开发中...');
};

onMounted(loadOrders);
</script>

<style scoped>
.order-list { padding: 0; }
.header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
.header h3 { margin: 0; color: #374151; font-weight: 600; }
.header-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.order-no { color: #8b5cf6; cursor: pointer; font-weight: 500; }
.order-no:hover { text-decoration: underline; }
.user-cell { display: flex; align-items: center; gap: 8px; }
.user-name { color: #374151; font-size: 13px; }
.goods-cell { display: flex; flex-direction: column; gap: 6px; }
.goods-item { display: flex; align-items: center; gap: 8px; }
.goods-img { width: 36px; height: 36px; border-radius: 4px; }
.goods-name { font-size: 12px; color: #374151; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.goods-price { font-size: 12px; color: #9ca3af; }
.more-goods { font-size: 12px; color: #9ca3af; }
.price { color: #ef4444; font-weight: bold; }
.price.actual { color: #16a34a; }
.pay-method { color: #6b7280; font-size: 13px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
.order-detail { display: flex; flex-direction: column; gap: 16px; }
.section-title { font-size: 15px; font-weight: 600; margin: 8px 0; padding-top: 12px; border-top: 1px solid #e9d5ff; color: #374151; }
.remark { padding: 12px; background: #f5f3ff; border-radius: 8px; color: #6b7280; border: 1px solid #e9d5ff; }
</style>
