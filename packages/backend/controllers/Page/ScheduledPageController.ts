import { Response } from 'express'
import { StatusCode } from '../../enum'
import { NotFoundError, BadRequestError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'

export const ScheduledPageController = async (req: Req, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('PAGE_ID_REQUIRED')

  const page = await prisma.page.findFirst({
    where: { id },
  })

  if (!page) throw new NotFoundError('CANT_FIND_PAGE')

  const updatedPage = await prisma.page.update({
    where: { id },
    data: {
      setStatus: 'scheduledOnline',
      onlineHtml: page.editedHtml,
    },
  })

  res.status(StatusCode.OK).json({ page: updatedPage })
}
