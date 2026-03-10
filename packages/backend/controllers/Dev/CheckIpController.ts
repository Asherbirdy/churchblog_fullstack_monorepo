import { StatusCode } from '@monorepo/libs'
import { Request, Response } from 'express'

export const CheckIpController = async (req: Request, res: Response) => {
  const ip = req.ip
  const ips = req.ips
  const clientIP = req.headers[ 'x-forwarded-for' ] || req.socket.remoteAddress
  res.status(StatusCode.OK).json({
    msg: 'IP checked',
    ip,
    ips,
    clientIP,
  })
}
