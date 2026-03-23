import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'

export const GetAllChatCardsController = async (req: Request, res: Response) => {
  const chatCards = await prisma.chatCard.findMany({
    include: { chatTopic: true },
  })

  res.status(StatusCode.OK).json({ chatCards })
}
