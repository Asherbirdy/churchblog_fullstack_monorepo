import { Request, Response } from 'express'
import { StatusCode, Role } from '../../enum'
import { BadRequestError, NotFoundError } from '../../errors'
import prisma from '../../db'

export const DeleteUserAccountController = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) {
    throw new BadRequestError('MISSING_USER_ID')
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND')
  }

  if (user.role === Role.admin) {
    throw new BadRequestError('CANNOT_DELETE_ADMIN')
  }

  await prisma.token.deleteMany({ where: { userId: id } })
  await prisma.user.delete({ where: { id } })

  res.status(StatusCode.OK).json({ msg: 'USER_DELETED' })
}
