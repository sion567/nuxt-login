export default defineEventHandler(async (event) => {
  console.log('New url: ' + getRequestURL(event))

  // 1. 定义需要拦截的路径前缀
  const PROXY_PREFIX = '/api'
  const isApi = event.path.startsWith(PROXY_PREFIX)

  // 避让逻辑：只有当你确定这个路径在 server/api 下没有对应文件时才代理
  // 但中间件很难自动判断文件是否存在，所以这很麻烦
  const EXCLUDED = ['/api/hello', '/api/login'] 

  // 2. 检查当前请求是否匹配前缀
  if (isApi && !EXCLUDED.includes(event.path)) {
    // 获取目标后端基础地址（建议从 runtimeConfig 获取）
    const config = useRuntimeConfig()
    const targetBase = config.backendUrl || 'https://api.example-server.com'
    // 3. 构建目标 URL
    // 例如：前端请求 /api/user -> 转发到 api.example-server.com
    // 如果后端接口没有 /api 前缀，可以使用 .replace(PROXY_PREFIX, '')
    const targetUrl = `${targetBase}${event.path}`

    try {
      // 4. 使用 h3 内置的 proxyRequest 进行透明代理
      // 它会自动处理 Headers、Method 和 Body 的转发
      return await proxyRequest(event, targetUrl, {
        // 配置项（可选）
        fetchOptions: {
          // 如果后端是自签名证书或开发环境，可跳过证书校验（生产环境慎用）
          // agent: ... 
        },
        // 可以在此处重写 Headers
        headers: {
          'x-proxy-source': 'nuxt-middleware',
        }
      })
    } catch (error) {
      console.error('Proxy Error:', error)
      throw createError({
        statusCode: 502,
        statusMessage: 'Bad Gateway: Proxy to backend failed',
      })
    }
  }
})

// 混合模式
// 在实际项目中，通常会这样配置：
// 全局代理 (api-proxy.ts)：走 api-proxy.ts (透明代理)
// 拦截 /api/v1/**。用于 80% 的基础 CRUD 操作（增删改查），节省开发时间。
// 具体接口 (server/api/**)：走 server/api + $api (BFF模式)
// 拦截特定路径（如 /api/v1/order/create）。如果你定义了同名的 server/api 文件，Nuxt 会优先匹配文件而非中间件。你可以在这些文件中编写特殊的业务逻辑。


// 优先级从高到低排列如下：
// 1. server/api/ 下的具体接口（最高优先级）
// 2. server/api/[...].ts（全路径捕获）
// 3. server/middleware/api-proxy.ts（最低/特殊优先级）虽然中间件在逻辑上“先”运行，但在匹配结果上，它的定位与前两者不同。
// 关键点： 中间件不能中断路由匹配（除非你在中间件里直接 return 响应并结束请求）。


// 不要在 middleware 里做proxyRequest。把代理逻辑写在 server/api/[...].ts 中。
// 机制： Nuxt 会先查找 server/api/hello.ts。
// 如果找到了： 执行它，不触发 [...].ts。
// 如果没找到： 才会掉进 [...].ts 执行 proxyRequest。


// middleware/proxy.ts负责 “在请求进入任何接口前，统一做点什么”。以下是它的剩余价值和典型场景：
// 1. 统一鉴权与重定向 (Global Auth Check)
// 2. 注入全局 Header (Context Injection)
// 3. 请求日志与监控 (Logging & Analytics)
// 4. 动态限流 (Rate Limiting)
// 有了[...].ts，你的 proxy.ts 就不再是一个“代理器”，而应该更名为 auth.ts 或 logger.ts，专注于处理横切关注点（AOP）。
