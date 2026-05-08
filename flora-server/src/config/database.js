const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'flora',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// 测试连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL数据库连接失败:', error.message);
    return false;
  }
}

// 通用查询
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// 插入数据
async function insert(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(',');
  const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
  const [result] = await pool.execute(sql, values);
  return result;
}

// 更新数据
async function update(table, data, where, whereParams = []) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setStr = keys.map(k => `${k} = ?`).join(',');
  const sql = `UPDATE ${table} SET ${setStr} WHERE ${where}`;
  const [result] = await pool.execute(sql, [...values, ...whereParams]);
  return result;
}

// 删除数据
async function remove(table, where, params = []) {
  const sql = `DELETE FROM ${table} WHERE ${where}`;
  const [result] = await pool.execute(sql, params);
  return result;
}

module.exports = {
  pool,
  query,
  insert,
  update,
  remove,
  testConnection
};
