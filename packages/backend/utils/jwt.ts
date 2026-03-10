
// https://jwt.io/introduction
import jwt from 'jsonwebtoken'
import config from '../config'

interface jwtPayload {
  user: {
    name: string
    userId: string
    role: string

  }
  refreshToken?: string
}

// 創造 JWT
export const createJWT = ({ payload }: { payload: jwtPayload }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is not defined in the config')
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}

// 認證 JWT
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isTokenValid = (token: any) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is not defined in the config')
  }
  return jwt.verify(token, process.env.JWT_SECRET)
}

// 將使用者資料 存在 cookie // user是tokenUser
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const attachCookieToResponse = ({ res, user, refreshToken }: any) => {
  const accessTokenJWT = createJWT({ payload: { user } })
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } })
  const oneDay = 1000 * 60 * 60 * 24

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: config.environment === 'PROD',
    signed: true,
    maxAge: 1000 * 60 * 15,
  })

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: config.environment === 'PROD',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  })
}
