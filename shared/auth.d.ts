declare module '#auth-utils' {
  interface User {
    id: number
    name: string
    role: string
  }

  interface UserSession {
    user?: User
    secure?: SecureSessionData
    loggedInAt?: string
  }

  interface SecureSessionData {
    // apiToken: string
    // refreshToken: string
    // expiresAt: number
    sid: string
  }
}

export {}