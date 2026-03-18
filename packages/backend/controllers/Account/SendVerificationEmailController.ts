import { Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError, NotFoundError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'
import { generateOTP, sendOTP } from '../../utils/emailService'

export const SendVerificationEmailController = async (req: Req, res: Response) => {
  const { email } = req.body

  if (!email) {
    throw new BadRequestError('EMAIL_REQUIRED')
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })

  // 如果 email 已經存在，但不是同個 user，則回傳錯誤
  if (existingUser && existingUser.id !== req.user?.userId) {
    throw new BadRequestError('EMAIL_ALREADY_EXISTS')
  }

  const user = await prisma.user.findUnique({ where: { id: req.user?.userId } })

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND')
  }

  // If user is blocked, check block time
  if (user.isBlocked) {
    const currentTime = new Date()
    if (user.blockUntil && currentTime < user.blockUntil) {
      res.status(StatusCode.FORBIDDEN).json({
        errCode: 'ACCOUNT_BLOCKED',
        msg: 'Account blocked. Try after some time.',
      })
      return
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isBlocked: false, otpAttempts: 0 },
    })
  }

  // Check for minimum 1-minute gap between OTP requests
  const currentTime = new Date()

  if (user.otpCreatedTime && currentTime.getTime() - user.otpCreatedTime.getTime() < 60000) {
    res.status(StatusCode.BAD_REQUEST).json({
      errCode: 'MINIMUM_1_MINUTE_GAP_REQUIRED',
      msg: 'Minimum 1-minute gap required between OTP requests',
    })
    return
  }

  const otp = generateOTP()

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp,
      otpCreatedTime: currentTime,
      email,
    },
  })

  sendOTP(email, otp)

  res.status(StatusCode.OK).json({ msg: 'VERIFICATION_EMAIL_SENT' })
}
