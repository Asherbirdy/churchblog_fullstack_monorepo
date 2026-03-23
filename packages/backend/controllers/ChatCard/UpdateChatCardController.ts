import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError, NotFoundError } from '../../errors'
import prisma from '../../db'

export const UpdateChatCardController = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('CHAT_CARD_ID_REQUIRED')

  const { name, url, description, chatTopicId, online } = req.body

  const existing = await prisma.chatCard.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('CHAT_CARD_NOT_FOUND')

  if (chatTopicId) {
    const topic = await prisma.chatTopic.findUnique({ where: { id: chatTopicId } })
    if (!topic) throw new NotFoundError('CHAT_TOPIC_NOT_FOUND')
  }

  const chatCard = await prisma.chatCard.update({
    where: { id },
    data: {
      ... (name !== undefined && { name }),
      ... (url !== undefined && { url }),
      ... (description !== undefined && { description }),
      ... (chatTopicId !== undefined && { chatTopicId }),
      ... (online !== undefined && { online }),
    },
  })

  res.status(StatusCode.OK).json({ chatCard })
}
