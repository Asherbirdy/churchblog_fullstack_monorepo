import { Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'
import { Req } from '../../types'

export const ResetPageController = async (req: Req, res: Response) => {
  await prisma.page.updateMany({
    data: {
      isEdit: false,
    },
  })

  res.status(StatusCode.OK).json({ msg: 'RESET_ALL_PAGES_SUCCESS' })
}
