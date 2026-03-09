import { Response } from 'express'
import { StatusCode } from '../../enums'
import { UnauthenticatedError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'

export const GetAllPagesController = async (req: Req, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('Authentication Invalid')

  const { status } = req.query

  const where: any = { createdById: req.user.userId }
  if (status) {
    where.status = status
  } else {
    where.status = { not: 'trash' }
  }

  const pages = await prisma.page.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
  })

  res.status(StatusCode.OK).json({ pages })
}
