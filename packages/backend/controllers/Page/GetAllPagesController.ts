import { Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'
import { Req } from '../../types'

export const GetAllPagesController = async (req: Req, res: Response) => {
  const pages = await prisma.page.findMany()
  res.status(StatusCode.OK).json({ pages })
}
