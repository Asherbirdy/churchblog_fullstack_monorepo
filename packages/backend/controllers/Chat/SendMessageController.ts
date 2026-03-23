import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError } from '../../errors'
import prisma from '../../db'

export const SendMessageController = async (req: Request, res: Response) => {
  const { message } = req.body
  if (!message) throw new BadRequestError('MESSAGE_REQUIRED')

  const chatTopics = await prisma.chatTopic.findMany({
    include: { cards: { where: { online: true } } },
  })

  const matched = chatTopics.filter((topic) =>
    topic.keywords.some((keyword) => message.includes(keyword)),
  )

  if (!matched.length) {
    return res.status(StatusCode.OK).json({
      found: false,
      chatTopics: [],
    })
  }

  res.status(StatusCode.OK).json({
    found: true,
    chatTopics: matched,
  })
}
