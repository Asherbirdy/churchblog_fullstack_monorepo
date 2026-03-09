import { Request, Response } from 'express'
import { StatusCode } from '@monorepo/libs'
import prisma from '../../db'
import { createTokenUser, attachCookieToResponse } from '../../utils'
import bcrypt from 'bcryptjs'

export const RegisterController = async (req: Request, res: Response) => {
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
}
