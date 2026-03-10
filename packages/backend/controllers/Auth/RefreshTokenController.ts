import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'
import config from '../../config'
import { attachCookieToResponse, isTokenValid } from '../../utils'
import { UnauthenticatedError } from '../../errors'

export const RefreshTokenController = async (req: Request, res: Response) => {
  let jwtRefreshToken = null

  if (config.auth_token === 'HEADER') {
    const authHeader = req.headers[ 'authorization' ]
    if (authHeader) {
      jwtRefreshToken = authHeader.split(' ')[ 1 ]
    }
  }

  if (config.auth_token === 'COOKIES') {
    const { refreshToken } = req.signedCookies
    if (refreshToken) {
      jwtRefreshToken = refreshToken
    }
  }

  if (!jwtRefreshToken) {
    throw new UnauthenticatedError('AUTHENTICATION_INVALID')
  }

  interface RefreshTokenPayload {
    user: {
      name: string
      userId: string
      role: string
    }
    refreshToken?: string
  }

  const payload = isTokenValid(jwtRefreshToken) as RefreshTokenPayload

  const existingToken = await prisma.token.findFirst({
    where: {
      userId: payload.user.userId,
      refreshToken: payload.refreshToken,
      isValid: true,
    },
  })

  if (!existingToken) {
    throw new UnauthenticatedError('AUTHENTICATION_INVALID')
  }

  const token = attachCookieToResponse({
    res,
    user: payload.user,
    refreshToken: existingToken.refreshToken,
  })

  res.status(StatusCode.OK).json({
    msg: 'TOKEN_REFRESHED',
    jwtAccessToken: token,
  })
}
