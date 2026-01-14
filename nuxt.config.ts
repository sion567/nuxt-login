// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-auth-utils'],
  runtimeConfig: {
    session: {
      name: 'nuxt-session',
      password: import.meta.env.NUXT_SESSION_PASSWORD,
      cookie: {
        sameSite: 'lax', // 防止 CSRF
        secure: true,    // 强制 HTTPS
        httpOnly: true,  // 彻底禁止 JS 读取（nuxt-auth-utils 默认已开启）
        maxAge: 60 * 60 * 24 // Cookie 本身的有效期
      }
    }
  }
})