import { Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'
import { Req } from '../../types'
import { NotFoundError } from '../../errors'

export const GetPageByRouteNameController = async (req: Req, res: Response) => {
  const { routeName } = req.params

  const page = await prisma.page.findFirst({
    where: { routeName },
  })

  if (!page) {
    throw new NotFoundError('PAGE_NOT_FOUND')
  }

  res.status(StatusCode.OK).json({ page })
}
