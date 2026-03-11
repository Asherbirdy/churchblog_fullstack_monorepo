import { Response } from 'express'
import { StatusCode, RecordStatus } from '../../enum'
import prisma from '../../db'
import { Req } from '../../types'

export const GetOnlinePageController = async (req: Req, res: Response) => {
  const onlinePages = await prisma.page.findMany({
    where: { status: RecordStatus.online },
    select: { id: true, name: true ,status: true},
  })

  res.status(StatusCode.OK).json({ onlinePages })
}
