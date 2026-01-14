import type { EventHandlerRequest, H3Event } from 'h3'

export const $api = async (event: H3Event<EventHandlerRequest>, url: string, opts: any = {}) => {
  let session = await getUserSession(event)
  const config = useRuntimeConfig()
  const baseURL = config.backendUrl || 'http://localhost:8080'

  // --- 自动刷新逻辑开始 ---
  if (session.secure?.refreshToken && session.secure.expiresAt) {
    const bufferTime = 30 * 1000 // 提前30秒刷新，防止临界点失效
    const now = Date.now()

    if (now + bufferTime > session.secure.expiresAt) {
      try {
        // 向 Spring Boot 换取新 Token
        const refreshResponse = await $fetch<{ token: string, expires_in: number }>(`${baseURL}/auth/refresh`, {
          method: 'POST',
          body: { refreshToken: session.secure.refreshToken }
        })

        // 更新 Nuxt 加密 Session
        await setUserSession(event, {
          ...session,
          secure: {
            ...session.secure,
            apiToken: refreshResponse.token,
            expiresAt: Date.now() + refreshResponse.expires_in * 1000
          }
        })
        
        // 重新获取更新后的 session 供本次请求使用
        session = await getUserSession(event)
      } catch (err) {
        // 刷新失败（如 refreshToken 也过期了），强制登出
        await clearUserSession(event)
        throw createError({ statusCode: 401, message: '会话已过期，请重新登录' })
      }
    }
  }
  // --- 自动刷新逻辑结束 ---

  return $fetch(url, {
    ...opts,
    baseURL,
    headers: {
      Authorization: `Bearer ${session.secure?.apiToken}`,
      ...opts.headers,
    }
  })
}

// 如果你必须保持后端 Token 极短（如 15 分钟），那么 刷新逻辑发生在 Nuxt Server，而不是浏览器。