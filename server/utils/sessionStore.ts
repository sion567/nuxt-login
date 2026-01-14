import type { EnhancedToken } from '#shared/types/auth'

export const useServerStorage = () => {
  // 使用 Nitro 内置的缓存/存储系统
  return useStorage('tokens'); // 在 nuxt.config 中可以配置驱动为 redis
}

// 调用示例
export const saveToken = async (id: string, data: TokenResponse) => {
  await useStorage().setItem(`tokens:${id}`, transformTokenResponse(data));
}

export const getToken = async (id: string) => {
  return await useStorage().getItem<EnhancedToken>(`tokens:${id}`);
}


// 为了解决“JWT 太大”和“安全托管”的矛盾，建议采用 “Session 映射” 模式：
// 不在 Cookie 里存完整的 JWT，只存一个 UUID（Session ID），真正的长 JWT 存在后端的 Redis 中。