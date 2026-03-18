import { Request, Response } from 'express'
import { StatusCode, Role } from '../../enum'
import prisma from '../../db'
import { createTokenUser, attachCookieToResponse } from '../../utils'
import { BadRequestError } from '../../errors'
import bcrypt from 'bcryptjs'

export const AdminInitController = async (req: Request, res: Response) => {
  const existingAdmin = await prisma.user.findFirst({ where: { role: Role.admin } })
  if (existingAdmin) {
    throw new BadRequestError('ADMIN_ALREADY_EXISTS')
  }

  const { name, email, password } = req.body
  if (!name || !email || !password) {
    throw new BadRequestError('MISSING_REQUIRED_FIELDS')
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new BadRequestError('EMAIL_ALREADY_IN_USE')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: Role.admin },
  })

  const tokenUser = createTokenUser(user)
  attachCookieToResponse({ res, user: tokenUser })
  res.status(StatusCode.CREATED).json({ user: tokenUser })
}
