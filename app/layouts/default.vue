<template>
  <div>
    <header style="display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #eee;">
      <nav class="nav-container">
        <NuxtLink to="/" class="nav-item">首页</NuxtLink>
        <NuxtLink to="/dashboard" class="nav-item">仪表盘</NuxtLink>
      </nav>
        
      <!-- 直接使用组件 -->
      <AppHeader />
    </header>

    <main style="padding: 2rem;">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.nav-container {
  display: flex;
  gap: 1.5rem; /* 链接之间的间距 */
  align-items: center;
}

.nav-item {
  text-decoration: none;
  color: #64748b; /* 默认灰色 */
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

/* 悬停效果 */
.nav-item:hover {
  color: #3b82f6; /* 蓝色 */
  background-color: #eff6ff;
}

/* 重点：Nuxt 自动添加的激活类名 */
.nav-item.router-link-active {
  color: #3b82f6;
  background-color: #dbeafe;
  font-weight: 600;
}
</style>