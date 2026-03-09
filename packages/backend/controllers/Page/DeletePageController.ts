import { Response } from 'express'
import { StatusCode } from '../../enums'
import { UnauthenticatedError, NotFoundError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'

export const DeletePageController = async (req: Req, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('AUTHENTICATION_INVALID')

  const { id } = req.params

  const page = await prisma.page.findFirst({
    where: { id, createdById: req.user.userId },
  })

  if (!page) throw new NotFoundError('CANT_FIND_PAGE')

  await prisma.page.delete({ where: { id } })

  res.status(StatusCode.OK).json({ msg: '頁面已刪除' })
}
