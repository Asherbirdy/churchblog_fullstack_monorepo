import { Response } from 'express'
import { StatusCode } from '../../enum'
import { Req } from '../../types'

export const ResetPageController = async (req: Req, res: Response) => {
  res.status(StatusCode.OK).json({ msg: 'ResetPageController' })
}
