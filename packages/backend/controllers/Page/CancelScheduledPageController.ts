import { Response } from 'express'
import { StatusCode } from '../../enum'
import { NotFoundError, BadRequestError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'

export const CancelScheduledPageController = async (req: Req, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('PAGE_ID_REQUIRED')

  const { setStatus } = req.body
  if (!setStatus) throw new BadRequestError('INPUT_REQUIRED')

  const page = await prisma.page.findFirst({
    where: { id },
  })

  if (!page) throw new NotFoundError('CANT_FIND_PAGE')

  const data: Record<string, unknown> = { setStatus }

  if (setStatus === 'scheduledOffline') {
    if (page.status !== 'online') {
      throw new BadRequestError('PAGE_NOT_ONLINE')
    }
  } else {
    // 取消排程
    if (page.setStatus !== 'scheduledOffline') {
      throw new BadRequestError('PAGE_NOT_SCHEDULED_OFFLINE')
    }
    data.setStatus = 'none'
  }

  const updatedPage = await prisma.page.update({
    where: { id },
    data,
  })

  res.status(StatusCode.OK).json({ page: updatedPage })
}
