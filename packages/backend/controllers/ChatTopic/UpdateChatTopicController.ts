import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError, NotFoundError } from '../../errors'
import prisma from '../../db'

export const UpdateChatTopicController = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('CHAT_TOPIC_ID_REQUIRED')

  const { name, keywords } = req.body
  if (name === undefined && keywords === undefined) {
    throw new BadRequestError('INPUT_REQUIRED')
  }

  const existing = await prisma.chatTopic.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('CHAT_TOPIC_NOT_FOUND')

  const chatTopic = await prisma.chatTopic.update({
    where: { id },
    data: {
      ... (name !== undefined && { name }),
      ... (keywords !== undefined && { keywords }),
    },
  })

  res.status(StatusCode.OK).json({ chatTopic })
}
