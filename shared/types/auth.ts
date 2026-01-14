export interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

// 定义一个新的类型，包含计算后的字段
export type EnhancedToken = TokenResponse & {
  expiresAt: number
}

/**
 * 将后端返回的 TokenResponse 转换为包含绝对过期时间的对象
 */
export const transformTokenResponse = (res: TokenResponse): EnhancedToken => {
  return {
    ...res,
    // 使用 Date.now() 获取当前毫秒，加上秒数转换的毫秒
    expiresAt: Date.now() + res.expires_in * 1000
  }
}