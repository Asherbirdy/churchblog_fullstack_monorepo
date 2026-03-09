import { Response } from 'express'
import { StatusCode } from '../../enums'
import { UnauthenticatedError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'

export const CreatePageController = async (req: Req, res: Response) => {
  if (!req.user) throw new UnauthenticatedError('AUTHENTICATION_INVALID')

  const { contentHtml } = req.body

  const page = await prisma.page.create({
    data: {
      contentHtml: contentHtml || '',
      createdById: req.user.userId,
    },
  })

  res.status(StatusCode.CREATED).json({ page })
}
