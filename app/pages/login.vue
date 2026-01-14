<script setup>
const { loggedIn, user, session, fetch, clear } = useUserSession()
const credentials = reactive({ username: '', password: '' })

async function login() {
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
    // 登录成功后刷新 Session 状态
    await fetch()
    navigateTo('/dashboard')
  } catch (e) {
    alert('登录失败')
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- 未登录状态：显示登录表单 -->
      <div v-if="!loggedIn" class="auth-form">
        <h2 class="auth-title">欢迎回来</h2>
        <p class="auth-subtitle">请登录您的账号</p>
        
        <div class="input-group">
          <label>用户名</label>
          <input v-model="credentials.username" type="text" placeholder="请输入用户名" />
        </div>

        <div class="input-group">
          <label>密码</label>
          <input v-model="credentials.password" type="password" placeholder="请输入密码" />
        </div>

        <button class="btn-primary" @click="login">登录</button>

        <div class="divider">
          <span>或者</span>
        </div>

        <a href="/auth/github" class="btn-github">
          <span class="icon">GitHub</span> 使用 GitHub 登录
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 容器居中 */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

/* 卡片样式 */
.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

/* 标题与副标题 */
.auth-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  text-align: center;
}
.auth-subtitle {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
}

/* 输入框组 */
.input-group {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.input-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #444;
}
.input-group input {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.input-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 按钮样式 */
.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background-color: #2563eb;
}

.btn-outline {
  width: 100%;
  padding: 0.75rem;
  background-color: transparent;
  border: 1px solid #e0e0e0;
  color: #666;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover {
  background-color: #f9fafb;
  border-color: #ccc;
}

/* 分割线 */
.divider {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  text-align: center;
  color: #999;
  font-size: 0.75rem;
}
.divider::before, .divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #eee;
}
.divider span {
  padding: 0 10px;
}

/* 第三方登录 */
.btn-github {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: #24292f;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: opacity 0.2s;
}
.btn-github:hover {
  opacity: 0.9;
}

</style>