import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'

export const GetAllUserController = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBlocked: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  res.status(StatusCode.OK).json({ users })
}
