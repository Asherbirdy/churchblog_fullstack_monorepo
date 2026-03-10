import { Response } from 'express'
import { Req } from '../../types'
import { StatusCode } from '../../enum'

export const CheckValidTokenController = async (req: Req, res: Response) => {
  res.status(StatusCode.OK).json({
    status: 'success',
    msg: 'TOKEN_VALID'
  })
}
