import { Request, Response } from 'express'
import { Role, StatusCode } from '../../enum'
import { BadRequestError } from '../../errors'
import prisma from '../../db'
import bcrypt from 'bcryptjs'

export const RegisterUserController = async (req: Request, res: Response) => {
  const { name, password, email } = req.body
  if (!name || !password || !email) {
    throw new BadRequestError('MISSING_REQUIRED_FIELDS')
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new BadRequestError('EMAIL_ALREADY_IN_USE')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await prisma.user.create({
    data: { 
      name, 
      email, 
      password: hashedPassword, 
      role: Role.user 
    },
  })

  res.status(StatusCode.CREATED).json({ 
    user: { 
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role 
    } 
  })
}
