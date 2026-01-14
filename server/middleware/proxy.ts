export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  // 你的中间件逻辑
  console.log('New url: ' + url)

  // 只有路径以 /api 开头时才处理
  // if (!url.pathname.startsWith('/api')) return

  // 执行你的代理或其他逻辑
})