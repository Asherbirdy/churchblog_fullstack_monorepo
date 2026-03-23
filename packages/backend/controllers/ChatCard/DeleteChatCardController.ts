import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError, NotFoundError } from '../../errors'
import prisma from '../../db'

export const DeleteChatCardController = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('CHAT_CARD_ID_REQUIRED')

  const existing = await prisma.chatCard.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('CHAT_CARD_NOT_FOUND')

  await prisma.chatCard.delete({ where: { id } })

  res.status(StatusCode.OK).json({ msg: 'CHAT_CARD_DELETED' })
}
