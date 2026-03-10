import { Response } from 'express'
import { StatusCode, RecordStatus } from '../../enum'
import { NotFoundError, BadRequestError } from '../../errors'
import prisma from '../../db'
import { Req } from '../../types'
import type { IPageUpdate } from '../../type'

export const UpdatePageController = async (req: Req, res: Response) => {
  const { id } = req.params
  const { contentHtml, status, isEdit } = req.body

  const page = await prisma.page.findFirst({
    where: { id },
  })

  if (!page) throw new NotFoundError('CANT_FIND_PAGE')

  if (status && !Object.values(RecordStatus).includes(status)) {
    throw new BadRequestError('INVALID_STATUS_VALUE')
  }

  const data: IPageUpdate = {}
  
  // 更改什麼 body 就填寫什麼
  if (contentHtml !== undefined) data.contentHtml = contentHtml
  if (status !== undefined) data.status = status
  if (isEdit !== undefined) {
    data.isEdit = isEdit
    if (isEdit) data.lastEditedAt = new Date()
  }

  const updatedPage = await prisma.page.update({
    where: { id },
    data,
  })

  res.status(StatusCode.OK).json({ page: updatedPage })
}
