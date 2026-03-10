import { isTokenValid, attachCookieToResponse } from '../utils'
import { StatusCode, Role } from '../enum'
import prisma from '../db'
import { Request, Response, NextFunction } from 'express'
import { Req } from '../types'
import config from '../config'

interface UserPayload {
  user: {
    name: string;
    userId: string;
    role: string;
  };
  refreshToken?: string;
}

interface CustomRequest extends Request {
  user?: UserPayload['user'];
  signedCookies: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export const authenticateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  let jwtAccessToken = null
  let jwtrefreshToken = null
  
  if (config.auth_token === 'HEADER') {
    const authHeader = req.headers[ 'authorization' ]
    if (authHeader) {
      jwtAccessToken = authHeader.split(' ')[ 1 ]
    }
  }

  if (config.auth_token === 'COOKIES') {
    const { refreshToken, accessToken } = req.signedCookies
    if (accessToken) {
      jwtAccessToken = accessToken
      jwtrefreshToken = refreshToken
    }
  }

  try {
    if (jwtAccessToken) {
      const payload = isTokenValid(jwtAccessToken) as UserPayload
      req.user = payload.user
      return next()
    }
    const payload = isTokenValid(jwtrefreshToken) as UserPayload

    const existingToken = await prisma.token.findFirst({
      where: {
        userId: payload.user.userId,
        refreshToken: payload.refreshToken,
        isValid: true,
      },
    })

    if (!existingToken) {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        errCode: 'AUTHENTICATION_INVALID',
        msg: 'Authentication Invalid(如果是postman 要記得在header 加上Authorization: Bearer <token>)' 
      })
      return
    }
    attachCookieToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    })
    req.user = payload.user
    return next()
  } catch (error) {
    res.status(StatusCode.UNAUTHORIZED).json({ 
      errCode: 'AUTHENTICATION_INVALID',
      msg: 'Authentication Invalid(如果是postman 要記得在header 加上Authorization: Bearer <token>)' 
    })
    return
  }
}

export const authorizePermission = (... roles: Role[]) => {
  return (req: Req, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      res.status(StatusCode.UNAUTHORIZED).json({ 
        errCode: 'AUTHENTICATION_INVALID',
        msg: 'Authentication Invalid(如果是postman 要記得在header 加上Authorization: Bearer <token>)' 
      })
      return
    }
    next()
  }
}
