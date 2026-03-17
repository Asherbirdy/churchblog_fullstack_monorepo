import { Response } from 'express'
import { StatusCode, RecordStatus, SetStatus } from '../../enum'
import { NotFoundError, BadRequestError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'

export const SetPageToOfflineScheduledController = async (req: Req, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('PAGE_ID_REQUIRED')

  const page = await prisma.page.findFirst({
    where: { id },
  })

  if (!page) throw new NotFoundError('CANT_FIND_PAGE')
  if (page.status === RecordStatus.offline) throw new BadRequestError('PAGE_ALREADY_OFFLINE')

  const updatedPage = await prisma.page.update({
    where: { id },
    data: {
      setStatus: SetStatus.scheduledOffline,
      onlineHtml: page.previousHtml,
      previousHtml: page.onlineHtml,
    },
  })

  res.status(StatusCode.OK).json({ page: updatedPage })
}
