<!--src/App.vue - 根组件 (紫色主题配色)-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// 根组件
</script>

<style>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f3ff;
  color: #374151;
}

#app {
  width: 100%;
  height: 100vh;
}

/* Element Plus 主题覆盖 - 紫色主题 */
:root {
  --el-color-primary: #8b5cf6;
  --el-color-primary-light-3: #a78bfa;
  --el-color-primary-light-5: #c4b5fd;
  --el-color-primary-light-7: #ddd6fe;
  --el-color-primary-light-8: #ede9fe;
  --el-color-primary-light-9: #f5f3ff;
  --el-color-primary-dark-2: #7c3aed;
}

/* 按钮样式 */
.el-button--primary {
  background-color: #8b5cf6 !important;
  border-color: #8b5cf6 !important;
  color: #ffffff !important;
}
.el-button--primary:hover {
  background-color: #7c3aed !important;
  border-color: #7c3aed !important;
}

/* 链接样式 */
.el-link--primary {
  color: #8b5cf6 !important;
}

/* 输入框 */
.el-input__wrapper {
  box-shadow: 0 0 0 1px #d1d5db inset !important;
}
.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #8b5cf6 inset !important;
}
.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #8b5cf6 inset !important;
}

/* 卡片 */
.el-card {
  border: 1px solid #e9d5ff !important;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.08) !important;
}
.el-card__header {
  border-bottom: 1px solid #e9d5ff !important;
  background: #faf8ff !important;
}

/* 表格 */
.el-table th.el-table__cell {
  background-color: #faf8ff !important;
  color: #4b5563 !important;
  font-weight: 600 !important;
}
.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: #faf8ff !important;
}
.el-table tr:hover > td.el-table__cell {
  background-color: #f5f3ff !important;
}

/* 标签 */
.el-tag {
  border-color: #ddd6fe !important;
  color: #7c3aed !important;
  background-color: #f5f3ff !important;
}
.el-tag--success {
  background-color: #dcfce7 !important;
  color: #16a34a !important;
  border-color: #bbf7d0 !important;
}
.el-tag--warning {
  background-color: #fef3c7 !important;
  color: #d97706 !important;
  border-color: #fde68a !important;
}
.el-tag--danger {
  background-color: #fee2e2 !important;
  color: #dc2626 !important;
  border-color: #fecaca !important;
}
.el-tag--info {
  background-color: #f3f4f6 !important;
  color: #6b7280 !important;
  border-color: #e5e7eb !important;
}

/* 下拉菜单 */
.el-dropdown-menu {
  border: 1px solid #e9d5ff !important;
}
.el-dropdown-menu__item:hover {
  background-color: #f5f3ff !important;
  color: #8b5cf6 !important;
}

/* 对话框 */
.el-dialog {
  border: 1px solid #e9d5ff !important;
}
.el-dialog__header {
  border-bottom: 1px solid #e9d5ff !important;
}
.el-dialog__title {
  color: #374151 !important;
}

/* 分页 */
.el-pagination button:hover {
  color: #8b5cf6 !important;
}
.el-pager li:hover {
  color: #8b5cf6 !important;
}
.el-pager li.is-active {
  background-color: #8b5cf6 !important;
  color: #fff !important;
}

/* 消息提示 */
.el-message {
  border: 1px solid #e9d5ff !important;
}

/* 表单标签 */
.el-form-item__label {
  color: #4b5563 !important;
}

/* 步骤条 */
.el-step__title {
  color: #4b5563 !important;
}
.el-step__description {
  color: #6b7280 !important;
}
</style>
