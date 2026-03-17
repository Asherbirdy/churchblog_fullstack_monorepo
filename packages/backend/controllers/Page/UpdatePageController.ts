import { Response } from 'express'
import { StatusCode, RecordStatus } from '../../enum'
import { NotFoundError, BadRequestError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'
import type { IPageUpdate } from '../../type'

export const UpdatePageController = async (req: Req, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('PAGE_ID_REQUIRED')

  const { name, status, contentHtml, isEdit } = req.body
  if (
    name === undefined ||
    status === undefined ||
    contentHtml === undefined ||
    isEdit === undefined
  ) {
    throw new BadRequestError('INPUT_REQUIRED')
  }

  const page = await prisma.page.findFirst({
    where: { id },
  })

  if (!page) throw new NotFoundError('CANT_FIND_PAGE')

  if (status && !Object.values(RecordStatus).includes(status)) {
    throw new BadRequestError('INVALID_STATUS_VALUE')
  }

  const data: IPageUpdate = {
    name,
    status,
    contentHtml,
    isEdit,
    lastEditedAt: new Date(),
  }

  const updatedPage = await prisma.page.update({
    where: { id },
    data,
  })

  res.status(StatusCode.OK).json({ page: updatedPage })
}
