import { Response } from 'express'
import { StatusCode, SetStatus, RecordStatus } from '../../enum'
import prisma from '../../db'
import { Req } from '../../types'

export const BeforeBuildAndDeployController = async (req: Req, res: Response) => {
  // scheduledOnline -> status: online, setStatus: none
  await prisma.page.updateMany({
    where: { setStatus: SetStatus.scheduledOnline },
    data: {
      status: RecordStatus.online,
      setStatus: SetStatus.none,
    },
  })

  // scheduledOffline -> status: offline, setStatus: none
  await prisma.page.updateMany({
    where: { setStatus: SetStatus.scheduledOffline },
    data: {
      status: RecordStatus.offline,
      setStatus: SetStatus.none,
    },
  })

  res.status(StatusCode.OK).json({ message: 'ok' })
}
