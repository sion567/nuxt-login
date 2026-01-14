import { defineEventHandler, proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // 1. 获取后端基础地址
  const targetBase = config.backendUrl || 'https://api.example-server.com'

  // 2. 获取当前请求的路径
  // event.path 是包含 /api 前缀的全路径，例如 /api/v1/users
  const targetUrl = `${targetBase}${event.path}`

  console.log(`[Proxy] Forwarding request to: ${targetUrl}`)

  try {
    // 3. 透明代理转发
    // proxyRequest 会自动处理 Method, Body, Headers 和 Cookie
    return await proxyRequest(event, targetUrl, {
      // 可以在此处统一添加校验头，例如固定的 API Key
      headers: {
        'x-proxy-agent': 'Nuxt-Catch-All-Proxy'
      }
    })
  } catch (error: any) {
    // 4. 统一错误处理
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Proxy request failed: ' + error.message
    })
  }
})

// 不要用全局 middleware 做代理，而是把代理逻辑写在 server/api/[...].ts 中。
// 效果：
// 当请求 /api/login 时，由于 login.ts 文件存在，优先走 login.ts。
// 当请求 /api/other 时，没有匹配文件，自动掉进 [...].ts 的代理逻辑。
// 优点： 完美利用了 Nuxt 的路由优先级，不需要写 if 判断避让。