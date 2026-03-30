import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'
import { createTokenUser, attachCookieToResponse } from '../../utils'
import { BadRequestError, ForbiddenError, UnauthenticatedError } from '../../errors'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export const LoginController = async (req: Request, res: Response) => {
  const { email, password, otp } = req.body

  if (!email || !password || !otp) {
    throw new BadRequestError('MISSING_EMAIL_PASSWORD_OR_OTP')
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new UnauthenticatedError('INVALID_CREDENTIALS')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('INVALID_CREDENTIALS')
  }

  // If user is blocked, check block time
  if (user.isBlocked) {
    const currentTime = new Date()
    if (user.blockUntil && currentTime < user.blockUntil) {
      throw new ForbiddenError('ACCOUNT_BLOCKED')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isBlocked: false, otpAttempts: 0 },
    })
  }

  // Check OTP
  if (user.otp !== otp) {
    const newAttempts = user.otpAttempts + 1

    if (newAttempts >= 5) {
      const blockUntil = new Date()
      blockUntil.setHours(blockUntil.getHours() + 1)

      await prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: newAttempts, isBlocked: true, blockUntil },
      })
    }
    else {
      await prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: newAttempts },
      })
    }

    throw new ForbiddenError('INVALID_OTP')
  }

  // Check if OTP is within 5 minutes
  const currentTime = new Date()

  if (user.otpCreatedTime && currentTime.getTime() - user.otpCreatedTime.getTime() > 5 * 60 * 1000) {
    throw new ForbiddenError('OTP_EXPIRED')
  }

  // Clear OTP after successful verification
  await prisma.user.update({
    where: { id: user.id },
    data: { otp: null, otpCreatedTime: null, otpAttempts: 0 },
  })

  const tokenUser = createTokenUser(user)
  let refreshToken = ''
  const existingToken = await prisma.token.findFirst({
    where: { userId: user.id, isValid: true },
  })

  if (existingToken) {
    const ip = req.ip || ''
    await prisma.token.update({
      where: { id: existingToken.id },
      data: { ip },
    })
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

