import { Response } from 'express'
import { StatusCode, SetStatus } from '../../enum'
import { NotFoundError, BadRequestError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'

export const GoToPreviousHtmlController = async (req: Req, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('PAGE_ID_REQUIRED')

  const page = await prisma.page.findFirst({
    where: { id },
  })

  if (!page) throw new NotFoundError('CANT_FIND_PAGE')
  if (!page.onlineHtml) throw new BadRequestError('NO_ONLINE_HTML')
  if (page.setStatus === SetStatus.scheduledOnline || page.setStatus === SetStatus.scheduledOffline) {
    throw new BadRequestError('PAGE_IS_SCHEDULED')
  }

  const updatedPage = await prisma.page.update({
    where: { id },
    data: {
      editedHtml: page.onlineHtml,
      isEdit: false,
    },
  })

  res.status(StatusCode.OK).json({ page: updatedPage })
}
