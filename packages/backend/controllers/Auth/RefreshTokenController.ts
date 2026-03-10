import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'
import { attachCookieToResponse, isTokenValid } from '../../utils'
import { UnauthenticatedError } from '../../errors'

export const RefreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken: refreshTokenJWT } = req.signedCookies

  if (!refreshTokenJWT) {
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

  const payload = isTokenValid(refreshTokenJWT) as RefreshTokenPayload

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

  attachCookieToResponse({
    res,
    user: payload.user,
    refreshToken: existingToken.refreshToken,
  })

  res.status(StatusCode.OK).json({ msg: 'TOKEN_REFRESHED' })
}
