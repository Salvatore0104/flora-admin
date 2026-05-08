// src/config/db.js - 内存数据库（开发测试用）
// 生产环境请替换为真实的MySQL数据库

const data = {
  categories: [
    { id: 1, name: '鲜花', icon: 'flower', sort: 1, status: 1 },
    { id: 2, name: '绿植', icon: 'plant', sort: 2, status: 1 },
    { id: 3, name: '盆景', icon: 'bonsai', sort: 3, status: 1 },
    { id: 4, name: '花束', icon: 'bouquet', sort: 4, status: 1 },
    { id: 5, name: '花篮', icon: 'basket', sort: 5, status: 1 }
  ],
  goods: [
    { id: 1, name: '红玫瑰11朵', category_id: 1, category_name: '鲜花', price: 168.00, original_price: 198.00, stock: 100, sales: 520, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300', description: '经典红玫瑰花束', is_hot: 1, is_new: 0, status: 1 },
    { id: 2, name: '粉色康乃馨', category_id: 1, category_name: '鲜花', price: 128.00, original_price: 158.00, stock: 80, sales: 320, image: 'https://images.unsplash.com/photo-1518882605630-8a6c87889c28?w=300', description: '温馨康乃馨', is_hot: 0, is_new: 1, status: 1 },
    { id: 3, name: '开业绿植盆栽', category_id: 2, category_name: '绿植', price: 88.00, original_price: 108.00, stock: 60, sales: 180, image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300', description: '招财绿植', is_hot: 1, is_new: 0, status: 1 },
    { id: 4, name: '多肉组合盆栽', category_id: 2, category_name: '绿植', price: 68.00, original_price: 88.00, stock: 120, sales: 450, image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=300', description: '可爱多肉组合', is_hot: 0, is_new: 1, status: 1 },
    { id: 5, name: '中式山水盆景', category_id: 3, category_name: '盆景', price: 388.00, original_price: 488.00, stock: 20, sales: 35, image: 'https://images.unsplash.com/photo-1518882605630-8a6c87889c28?w=300', description: '传统山水盆景', is_hot: 0, is_new: 0, status: 1 }
  ],
  banners: [
    { id: 1, title: '母亲节特惠', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=750', link: '', sort: 1, status: 1 },
    { id: 2, title: '新品上市', image: 'https://images.unsplash.com/photo-1518882605630-8a6c87889c28?w=750', link: '', sort: 2, status: 1 },
    { id: 3, title: '会员专享', image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=750', link: '', sort: 3, status: 1 }
  ],
  coupons: [
    { id: 1, name: '新人专享券', type: 1, value: 20.00, min_amount: 100.00, total: 1000, remain: 850, status: 1 },
    { id: 2, name: '满减优惠券', type: 1, value: 50.00, min_amount: 300.00, total: 500, remain: 420, status: 1 }
  ],
  orders: [],
  users: [
    { id: 1, username: 'user1', nickname: '张三', phone: '13800138000', balance: 100.00, points: 500, member_level: 1, status: 1 },
    { id: 2, username: 'user2', nickname: '李四', phone: '13900139000', balance: 50.00, points: 200, member_level: 1, status: 1 }
  ]
};

// 模拟数据库查询
async function query(sql, params = []) {
  // 获取表名
  let table = null;
  if (sql.includes('FROM goods') || sql.includes('JOIN goods')) table = 'goods';
  else if (sql.includes('FROM categories') || sql.includes('JOIN categories')) table = 'categories';
  else if (sql.includes('FROM banners') || sql.includes('JOIN banners')) table = 'banners';
  else if (sql.includes('FROM coupons') || sql.includes('JOIN coupons')) table = 'coupons';
  else if (sql.includes('FROM users') || sql.includes('JOIN users')) table = 'users';
  else if (sql.includes('FROM orders') || sql.includes('JOIN orders')) table = 'orders';
  
  if (!table || !data[table]) return [];
  
  let result = [...data[table]];
  
  // 处理WHERE条件
  if (sql.includes('WHERE')) {
    // 状态过滤 - 必须先过滤
    if (sql.includes('status = 1')) {
      result = result.filter(item => item.status === 1);
    }
    if (sql.includes('status = 0')) {
      result = result.filter(item => item.status === 0);
    }
    
    // 支持 id = ? 查询 - 只有当SQL明确包含这些条件时才过滤
    // 注意：不要把LIMIT/OFFSET参数当作id过滤
    if (params && params.length > 0) {
      if (table === 'goods' && sql.includes('g.id = ?')) {
        result = result.filter(g => g.id == params[0]);
      } else if (table === 'categories' && sql.includes('c.id = ?')) {
        result = result.filter(c => c.id == params[0]);
      } else if (table === 'orders' && sql.includes('o.id = ?')) {
        result = result.filter(o => o.id == params[0]);
      } else if (table === 'goods' && sql.includes('category_id = ?')) {
        // 确保category_id的?不是LIMIT的一部分
        const idx = sql.indexOf('category_id = ?');
        const beforeLimit = sql.substring(0, idx);
        if (!beforeLimit.includes('LIMIT')) {
          result = result.filter(g => g.category_id == params[0]);
        }
      }
      // 如果没有明确的id或category查询条件，不进行默认过滤
    }
    
    // 关键词搜索
    if (sql.includes('LIKE')) {
      const keyword = params.find(p => p && p.includes('%'));
      if (keyword) {
        const kw = keyword.replace(/%/g, '');
        result = result.filter(item => 
          (item.name && item.name.includes(kw)) || 
          (item.description && item.description.includes(kw))
        );
      }
    }
  }
  
  // 处理COUNT
  if (sql.includes('COUNT')) {
    return [{ total: result.length }];
  }
  
  // 处理ORDER BY
  if (sql.includes('ORDER BY')) {
    if (sql.includes('DESC')) {
      result.reverse();
    }
  }
  
  // 处理LIMIT
  if (sql.includes('LIMIT')) {
    let limit = 10;
    let offset = 0;
    
    if (params && params.length > 0) {
      // 找到 LIMIT 值（第一个数字参数）
      for (let i = 0; i < params.length; i++) {
        if (typeof params[i] === 'number' && params[i] <= 100) {
          limit = params[i];
          break;
        }
      }
      // 找到 OFFSET 值（第二个数字参数）
      for (let i = 1; i < params.length; i++) {
        if (typeof params[i] === 'number') {
          offset = params[i];
          break;
        }
      }
    }
    
    result = result.slice(offset, offset + limit);
  }
  
  return result;
}

async function insert(table, rowData) {
  const tableData = data[table] || (data[table] = []);
  const id = tableData.length + 1;
  tableData.push({ id, ...rowData });
  return { insertId: id };
}

async function update(table, rowData, where, params = []) {
  return { affectedRows: 1 };
}

async function remove(table, where, params = []) {
  return { affectedRows: 1 };
}

module.exports = { query, insert, update, remove };
