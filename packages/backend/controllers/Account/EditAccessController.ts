import { Request, Response } from 'express'
import { AccessEnum, StatusCode } from '../../enum'
import { BadRequestError, NotFoundError } from '../../errors'
import prisma from '../../db'

export const EditAccessController = async (req: Request, res: Response) => {
  const { userId, access } = req.body
  if (!userId || !access) {
    throw new BadRequestError('MISSING_REQUIRED_FIELDS')
  }

  if (!Array.isArray(access)) {
    throw new BadRequestError('ACCESS_MUST_BE_ARRAY')
  }

  const validValues = Object.values(AccessEnum)
  const isValid = access.every((item: string) => validValues.includes(item as AccessEnum))
  if (!isValid) {
    throw new BadRequestError('INVALID_ACCESS_VALUE')
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND')
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { access },
  })

  res.status(StatusCode.OK).json({
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      access: updatedUser.access,
    },
  })
}
