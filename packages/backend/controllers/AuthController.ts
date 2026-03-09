import { Request, Response } from 'express'
import { StatusCode } from '../enums'
import prisma from '../db'
import { createTokenUser, attachCookieToResponse } from '../utils'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { Req } from '../types'

export const AuthController = {
  // ** register
  register: async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      res.status(StatusCode.BAD_REQUEST).json({ msg: '請提供名稱、信箱和密碼！' })
      return
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      res.status(StatusCode.BAD_REQUEST).json({ msg: `${ email } 已經被使用！` })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    const tokenUser = createTokenUser(user)
    attachCookieToResponse({ res, user: tokenUser })
    res.status(StatusCode.CREATED).json({ user: tokenUser })
  },

  // ** login
  login: async (req: Request, res: Response) => {
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
    const userAgent = req.headers['user-agent'] || ''
    const ip = req.ip || ''

    await prisma.token.create({
      data: { refreshToken, ip, userAgent, userId: user.id },
    })
    attachCookieToResponse({ res, user: tokenUser, refreshToken })

    res.status(StatusCode.OK).json({ user: tokenUser })
  },

  // ** logout
  logout: async (req: Req, res: Response) => {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({ msg: 'User not authenticated' })
    }

    await prisma.token.deleteMany({ where: { userId: req.user.userId } })

    res.cookie('accessToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
    })

    res.cookie('refreshToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
    })

    res.status(StatusCode.OK).json({ msg: 'user logged out!' })
  },
}
