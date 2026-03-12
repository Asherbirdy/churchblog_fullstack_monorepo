import { Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'
import { Req } from '../../types'

export const GetAllImageFoldersController = async (req: Req, res: Response) => {
  const imageFolders = await prisma.imageFolder.findMany({
    include: {
      images: true
    }
  })
  res.status(StatusCode.OK).json({ imageFolders })
}
