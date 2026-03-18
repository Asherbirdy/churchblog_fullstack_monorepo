import { Request, Response } from 'express'
import { Role, StatusCode } from '../../enum'
import { BadRequestError } from '../../errors'
import prisma from '../../db'
import bcrypt from 'bcryptjs'

export const AdminRegisterUserController = async (req: Request, res: Response) => {
  const { name, password, email } = req.body
  if (!name || !password || !email) {
    throw new BadRequestError('MISSING_REQUIRED_FIELDS')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await prisma.user.create({
    data: { 
      name, 
      email, 
      password: hashedPassword, 
      role: Role.admin 
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
