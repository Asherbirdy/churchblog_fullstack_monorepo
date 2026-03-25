import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError, ForbiddenError, NotFoundError } from '../../errors'
import prisma from '../../db'
import { generateOTP, sendOTP } from '../../utils/emailService'

export const ForgetPasswordEmailOTPController = async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    throw new BadRequestError('MISSING_EMAIL')
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND')
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

  res.status(StatusCode.OK).json({ msg: 'FORGET_PASSWORD_OTP_SENT' })
}
