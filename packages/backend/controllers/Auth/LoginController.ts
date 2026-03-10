import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'
import { createTokenUser, attachCookieToResponse } from '../../utils'
import { BadRequestError, UnauthenticatedError } from '../../errors'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export const LoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('MISSING_EMAIL_OR_PASSWORD')
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new UnauthenticatedError('INVALID_CREDENTIALS')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('INVALID_CREDENTIALS')
  }

  const tokenUser = createTokenUser(user)
  let refreshToken = ''
  const existingToken = await prisma.token.findFirst({
    where: { userId: user.id, isValid: true },
  })

  if (existingToken) {
    refreshToken = existingToken.refreshToken
    const token = attachCookieToResponse({ res, user: tokenUser, refreshToken })
    res.status(StatusCode.OK).json({ user: tokenUser, token })
    return
  }

  refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers[ 'user-agent' ] || ''
  const ip = req.ip || ''

  await prisma.token.create({
    data: { refreshToken, ip, userAgent, userId: user.id },
  })
  const token = attachCookieToResponse({ res, user: tokenUser, refreshToken })
  
  res.status(StatusCode.OK).json({ user: tokenUser, token })
}

