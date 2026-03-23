import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError } from '../../errors'
import prisma from '../../db'

export const CreateChatTopicController = async (req: Request, res: Response) => {
  const { name, keywords } = req.body
  if (!name) throw new BadRequestError('NAME_REQUIRED')

  const existing = await prisma.chatTopic.findFirst({ where: { name } })
  if (existing) throw new BadRequestError('CHAT_TOPIC_NAME_ALREADY_EXISTS')

  const chatTopic = await prisma.chatTopic.create({
    data: {
      name,
      keywords: keywords || [],
    },
  })

  res.status(StatusCode.CREATED).json({ chatTopic })
}
