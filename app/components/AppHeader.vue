<script setup lang="ts">
// loggedIn 是响应式的，一旦登录或退出，UI 自动变化
const { user, session, loggedIn, clear, fetch } = useUserSession()

/**
 * 方法 1：在前端组件中直接实现
 * 它是 nuxt-auth-utils 的设计初衷，最符合 Nuxt 3 的极简哲学。
 */
async function handleLogout1() {
  // 1. 清除客户端和服务端的 Session Cookie
  await clear() // 前端的 clear() 是对后端接口的封装，它会调用内置的接口来删除加密 Cookie，并重置前端的 user 响应式变量 1。
  
  // 2. 跳转到登录页或首页
  await navigateTo('/login')
}
/**
 * 方法 2：通过 Server API 实现（如果需要额外逻辑）
 */
async function handleLogout2() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  // 更新前端的 Session 状态
  await fetch()
  navigateTo('/login')
}
</script>

<template>
  <div class="user-menu">
    <!-- 情况 A: 用户已登录 -->
    <div v-if="loggedIn && user" class="flex-center">
      <span class="user-info">欢迎，{{ user.name }}</span>
      <p>[Logged in since: {{ session?.loggedInAt }}]</p>
      <button @click="handleLogout1" class="logout-btn">退出登录</button>
    </div>

    <!-- 情况 B: 用户未登录 -->
    <div v-else>
      <NuxtLink to="/login" class="login-link">登录</NuxtLink>
    </div>
  </div>
</template>


<style scoped>
.flex-center {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-info {
  font-weight: 500;
  color: #333;
}
.logout-btn {
  padding: 4px 12px;
  background-color: #ef4444;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
.login-link {
  color: #3b82f6;
  text-decoration: underline;
}
</style>