import { Request, Response } from 'express'
import { StatusCode } from '../../enum'
import { BadRequestError } from '../../errors'
import prisma from '../../db'

export const CreateChatTopicController = async (req: Request, res: Response) => {
  const { name, keywords } = req.body
  if (!name) throw new BadRequestError('NAME_REQUIRED')

  const inputKeywords: string[] = keywords || []

  if (inputKeywords.length > 0) {
    const existing = await prisma.chatTopic.findMany({
      where: { keywords: { hasSome: inputKeywords } },
      select: { name: true, keywords: true },
    })

    if (existing.length > 0) {
      const existingKeywords = existing.flatMap((t) => t.keywords)
      const duplicates = inputKeywords.filter((k) => existingKeywords.includes(k))
      throw new BadRequestError(`KEYWORD_DUPLICATED: ${ duplicates.join(', ') }`)
    }
  }

  const chatTopic = await prisma.chatTopic.create({
    data: {
      name,
      keywords: inputKeywords,
    },
  })

  res.status(StatusCode.CREATED).json({ chatTopic })
}
