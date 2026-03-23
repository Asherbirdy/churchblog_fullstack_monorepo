import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError, NotFoundError } from '../../errors'
import prisma from '../../db'

export const DeleteChatTopicController = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) throw new BadRequestError('CHAT_TOPIC_ID_REQUIRED')

  const existing = await prisma.chatTopic.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('CHAT_TOPIC_NOT_FOUND')

  await prisma.chatCard.deleteMany({ where: { chatTopicId: id } })
  await prisma.chatTopic.delete({ where: { id } })

  res.status(StatusCode.OK).json({ msg: 'CHAT_TOPIC_DELETED' })
}
