export interface LoginPayload {
  email: string
  password: string
  otp: string
}

export interface LoginResponse {
  user: LoginUser
  token: LoginToken
}

export interface LoginUser {
  name: string
  userId: string
  role: string
  emailVerified: boolean
}

export interface LoginToken {
  accessTokenJWT: string
  refreshTokenJWT: string
}