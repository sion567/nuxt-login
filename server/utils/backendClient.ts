import type { EventHandlerRequest, H3Event } from 'h3'
import type { TokenResponse } from '#shared/types/auth'

export const $api = async (event: H3Event<EventHandlerRequest>, url: string, opts: any = {}) => {
  let session = await getUserSession(event)
  const sessionId = session.secure?.sid
  const config = useRuntimeConfig()
  const baseURL = config.backendUrl || 'http://localhost:8080'

   if (!sessionId) throw createError({ statusCode: 401 })
  const token = await getToken(sessionId)

  // --- 自动刷新逻辑开始 ---
  if (token && token.refresh_token && token?.expiresAt) {
    if (isTokenExpired(token?.expiresAt)) {
      try {
        // 向 Spring Boot 换取新 Token
        const refreshResponse = await $fetch<TokenResponse>(`${baseURL}/auth/refresh`, {
          method: 'POST',
          body: { refreshToken: token.refresh_token }
        })

        // 更新 Nuxt 加密 Session
        saveToken('sessionId', refreshResponse)
        // await setUserSession(event, {
        //   ...session,
        //   secure: {
        //     ...session.secure,
        //     apiToken: refreshResponse.token,
        //     expiresAt: Date.now() + refreshResponse.expires_in * 1000
        //   }
        // })
        
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
      Authorization: `Bearer ${token?.access_token}`,
      ...opts.headers,
    }
  })
}

const isTokenExpired = (expiresAt?: number) => {
  const bufferTime = 30 * 1000 // 提前30秒刷新，防止临界点失效
  const now = Date.now()
  if (!expiresAt) return true
  return now + bufferTime > expiresAt
}

// 如果你必须保持后端 Token 极短（如 15 分钟），那么 刷新逻辑发生在 Nuxt Server，而不是浏览器。