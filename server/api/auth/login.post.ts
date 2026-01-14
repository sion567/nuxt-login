import type { TokenResponse } from '#shared/types/auth'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  const sessionId = crypto.randomUUID()

    // const response = await $fetch<{ token: TokenResponse, user: any }>('http://localhost:8080/auth/login', {
    //   method: 'POST',
    //   body: body
    // })

  const response = {user: {id: 11, name: 'Admin', role: 'ADMIN'}, token: {access_token: 'long-lived-token', refresh_token: 'xxxx', expires_in: 500}}

  // 校验逻辑（示例：实际应查询数据库）
  if (username === 'admin' && password === '123456') {
    saveToken(sessionId, response.token)
    // 使用 setUserSession 存储用户信息到加密 Cookie 中
    await setUserSession(event, {
      user: response.user,
      // 将后端 Token 存在 Session 里，后续 Nuxt 请求 Spring Boot 时取出
      secure: {
        sid: sessionId,
        // apiToken: response.token.access_token,
        // refreshToken: response.token.refresh_token,
        // expiresAt: Date.now() + response.token.expires_in * 1000  // 计算出绝对过期时间戳
      },
      // 设置 Session Cookie 的有效期（单位秒），与后端 Token 保持一致
      config: {
          maxAge: 24 * 60 * 60 
      },
      loggedInAt: new Date().toISOString()
    })

    return { success: true }
  }

  throw createError({
    statusCode: 401,
    message: '用户名或密码错误'
  })
})