import { Response } from 'express'
import { StatusCode } from '../../enum'
import prisma from '../../db'
import { Req } from '../../types'

export const LogoutController = async (req: Req, res: Response) => {
  if (!req.user) {
    return res.status(StatusCode.UNAUTHORIZED).json({ msg: 'User not authenticated' })
  }

  await prisma.token.deleteMany({ where: { userId: req.user.userId } })

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })

  res.status(StatusCode.OK).json({ msg: 'user logged out!' })
}
