<script setup>
const { loggedIn } = useUserSession()

// 访问根路径时根据状态自动跳转
if (loggedIn.value) {
  await navigateTo('/dashboard')
} else {
  await navigateTo('/login')
}
</script>


<template>
  <h1>这是公开的首页</h1>
</template>