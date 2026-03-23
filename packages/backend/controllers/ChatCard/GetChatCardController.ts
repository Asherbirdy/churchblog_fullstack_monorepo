import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError, NotFoundError } from '../../errors'
import prisma from '../../db'

export const GetChatCardController = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('CHAT_CARD_ID_REQUIRED')

  const chatCard = await prisma.chatCard.findUnique({
    where: { id },
    include: { chatTopic: true },
  })

  if (!chatCard) throw new NotFoundError('CHAT_CARD_NOT_FOUND')

  res.status(StatusCode.OK).json({ chatCard })
}
