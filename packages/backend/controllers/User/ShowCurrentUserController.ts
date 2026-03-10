import { StatusCode } from '../../enum'
import prisma from '../../db'
import { Req } from '../../types'
import { Response } from 'express'

export const ShowCurrentUserController = async (req: Req, res: Response) => {
  if (!req.user) {
    return res.status(StatusCode.UNAUTHORIZED).json({ msg: 'User not authenticated' })
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  res.status(StatusCode.OK).json({
    msg: 'User fetched successfully',
    user,
  })
}
