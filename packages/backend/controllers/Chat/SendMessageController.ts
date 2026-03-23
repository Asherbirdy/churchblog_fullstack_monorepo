import { Request, Response } from 'express'
import { StatusCode } from '../../enum'

export const SendMessageController = async (req: Request, res: Response) => {
  res.status(StatusCode.OK).json({
    msg: 'Message sent',
  })
}
