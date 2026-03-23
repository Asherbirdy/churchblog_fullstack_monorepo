import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError, NotFoundError } from '../../errors'
import prisma from '../../db'

export const CreateChatCardController = async (req: Request, res: Response) => {
  const { name, url, description, chatTopicId } = req.body
  if (!name || !url || !chatTopicId) throw new BadRequestError('INPUT_REQUIRED')

  const topic = await prisma.chatTopic.findUnique({ where: { id: chatTopicId } })
  if (!topic) throw new NotFoundError('CHAT_TOPIC_NOT_FOUND')

  const chatCard = await prisma.chatCard.create({
    data: {
      name,
      url,
      description: description || '',
      chatTopicId,
    },
  })

  res.status(StatusCode.CREATED).json({ chatCard })
}
