import { Response } from 'express'
import { StatusCode, RecordStatus } from '../../enum'
import prisma from '../../db'
import { Req } from '../../types'

export const GetOnlinePageController = async (req: Req, res: Response) => {
  const onlinePage = await prisma.page.findFirst({
    where: { status: RecordStatus.online },
  })

  res.status(StatusCode.OK).json({ onlinePage })
}
