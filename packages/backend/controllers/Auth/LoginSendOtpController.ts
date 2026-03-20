import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'
import { BadRequestError, ForbiddenError, UnauthenticatedError } from '../../errors'
import { generateOTP, sendOTP } from '../../utils/emailService'
import bcrypt from 'bcryptjs'

export const LoginSendOtpController = async (req: Request, res: Response) => {
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
    throw new UnauthenticatedError('WRONG_PASSWORD_OR_EMAIL')
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

  // Check for minimum 1-minute gap between OTP requests
  const currentTime = new Date()

  if (user.otpCreatedTime && currentTime.getTime() - user.otpCreatedTime.getTime() < 60000) {
    throw new BadRequestError('MINIMUM_1_MINUTE_GAP_REQUIRED')
  }

  const otp = generateOTP()

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp,
      otpCreatedTime: currentTime,
    },
  })

  sendOTP(email, otp)

  res.status(StatusCode.OK).json({ msg: 'LOGIN_OTP_SENT' })
}
