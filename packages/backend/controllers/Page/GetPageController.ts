import { Response } from 'express'
import { StatusCode } from '../../enums'
import { UnauthenticatedError, NotFoundError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'

export const GetPageController = async (req: Req, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('AUTHENTICATION_INVALID')

  const { id } = req.params

  const page = await prisma.page.findFirst({
    where: { id, createdById: req.user.userId },
  })

  if (!page) throw new NotFoundError('CANT_FIND_PAGE')

  res.status(StatusCode.OK).json({ page })
}
