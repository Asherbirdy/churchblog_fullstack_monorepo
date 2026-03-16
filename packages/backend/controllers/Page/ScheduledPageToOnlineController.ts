import { Response } from 'express'
import { StatusCode } from '../../enum'
import { NotFoundError, BadRequestError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'

export const ScheduledPageToOnlineController = async (req: Req, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('PAGE_ID_REQUIRED')

  const { setStatus } = req.body
  if (!setStatus) throw new BadRequestError('INPUT_REQUIRED')

  const page = await prisma.page.findFirst({
    where: { id },
  })

  if (!page) throw new NotFoundError('CANT_FIND_PAGE')

  const data: Record<string, unknown> = { setStatus }

  if (setStatus === 'scheduledOnline') {
    // 安排上線：editedHtml 複製到 onlineHtml
    data.onlineHtml = page.editedHtml
    // 已上線的文章需要備份當前 onlineHtml 到 previousHtml
    if (page.status === 'online') {
      data.previousHtml = page.onlineHtml
    }
  } else {
    // 取消排程
    if (page.setStatus !== 'scheduledOnline') {
      throw new BadRequestError('PAGE_NOT_SCHEDULED_ONLINE')
    }
    if (page.status === 'offline') {
      // 未上線過的取消排程
      data.setStatus = 'offline'
      data.onlineHtml = ''
      data.previousHtml = ''
    } else {
      // 已上線的取消排程：還原 onlineHtml
      data.setStatus = 'none'
      data.onlineHtml = page.previousHtml
      data.previousHtml = ''
    }
  }

  const updatedPage = await prisma.page.update({
    where: { id },
    data,
  })

  res.status(StatusCode.OK).json({ page: updatedPage })
}
