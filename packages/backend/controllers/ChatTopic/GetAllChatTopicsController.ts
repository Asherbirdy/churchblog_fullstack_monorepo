import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'

export const GetAllChatTopicsController = async (req: Request, res: Response) => {
  const chatTopics = await prisma.chatTopic.findMany({
    include: { cards: true },
  })

  res.status(StatusCode.OK).json({ chatTopics })
}
