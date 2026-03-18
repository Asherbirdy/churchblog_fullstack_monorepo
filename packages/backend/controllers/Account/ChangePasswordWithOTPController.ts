import { Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError, ForbiddenError, NotFoundError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'
import bcrypt from 'bcryptjs'

export const ChangePasswordWithOTPController = async (req: Req, res: Response) => {
  const { email, otp, newPassword } = req.body

  if (!email || !otp || !newPassword) {
    throw new BadRequestError('ALL_FIELDS_REQUIRED')
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

  // Check OTP
  if (user.otp !== otp) {
    const newAttempts = user.otpAttempts + 1

    // If OTP attempts >= 5, block user for 1 hour
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

  // Hash new password and clear OTP
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      otp: null,
      otpCreatedTime: null,
      otpAttempts: 0,
    },
  })

  res.status(StatusCode.OK).json({ msg: 'PASSWORD_CHANGED_SUCCESSFULLY' })
}
