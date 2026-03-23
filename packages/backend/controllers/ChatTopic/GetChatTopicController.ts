import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError, NotFoundError } from '../../errors'
import prisma from '../../db'

export const GetChatTopicController = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('CHAT_TOPIC_ID_REQUIRED')

  const chatTopic = await prisma.chatTopic.findUnique({
    where: { id },
    include: { cards: true },
  })

  if (!chatTopic) throw new NotFoundError('CHAT_TOPIC_NOT_FOUND')

  res.status(StatusCode.OK).json({ chatTopic })
}
