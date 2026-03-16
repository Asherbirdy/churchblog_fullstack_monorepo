import { Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError, UnauthenticatedError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'

export const CreatePageController = async (req: Req, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('AUTHENTICATION_INVALID')

  const { name, routeName } = req.body
  if (!name || !routeName) throw new BadRequestError('INPUT_REQUIRED')

  const existing = await prisma.page.findFirst({ where: { routeName } })
  if (existing) throw new BadRequestError('ROUTE_NAME_ALREADY_EXISTS')

  const page = await prisma.page.create({
    data: {
      name: name || '',
      routeName: routeName || '',
      createdById: req.user.userId,
    },
  })

  res.status(StatusCode.CREATED).json({ page })
}
