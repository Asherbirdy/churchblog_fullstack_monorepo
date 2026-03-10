import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'
import { createTokenUser, attachCookieToResponse } from '../../utils'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export const LoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(StatusCode.BAD_REQUEST).json({ msg: '請提供帳號和密碼！' })
    return
  }
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    res.status(StatusCode.BAD_REQUEST).json({ msg: '錯誤帳號密碼' })
    return
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    res.status(StatusCode.BAD_REQUEST).json({ msg: '錯誤帳號密碼' })
    return
  }

  const tokenUser = createTokenUser(user)
  let refreshToken = ''
  const existingToken = await prisma.token.findFirst({
    where: { userId: user.id, isValid: true },
  })

  if (existingToken) {
    refreshToken = existingToken.refreshToken
    attachCookieToResponse({ res, user: tokenUser, refreshToken })
    res.status(StatusCode.OK).json({ user: tokenUser })
    return
  }

  refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers[ 'user-agent' ] || ''
  const ip = req.ip || ''

  await prisma.token.create({
    data: { refreshToken, ip, userAgent, userId: user.id },
  })
  attachCookieToResponse({ res, user: tokenUser, refreshToken })

  res.status(StatusCode.OK).json({ user: tokenUser })
}
