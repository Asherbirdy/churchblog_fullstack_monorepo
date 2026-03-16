import { Response } from 'express'
import { StatusCode, SetStatus, RecordStatus } from '../../enum'
import prisma from '../../db'
import { Req } from '../../types'

export const BeforeBuildAndDeployController = async (req: Req, res: Response) => {
  // scheduledOnline -> status: online, setStatus: none, previousHtml: onlineHtml
  const onlinePages = await prisma.page.findMany({
    where: { setStatus: SetStatus.scheduledOnline },
  })

  await Promise.all(
    onlinePages.map((page) =>
      prisma.page.update({
        where: { id: page.id },
        data: {
          status: RecordStatus.online,
          setStatus: SetStatus.none,
          isEdit: false,
          previousHtml: page.onlineHtml,
        },
      }),
    ),
  )

  // scheduledOffline -> status: offline, setStatus: none
  const offline = await prisma.page.updateMany({
    where: { setStatus: SetStatus.scheduledOffline },
    data: {
      status: RecordStatus.offline,
      setStatus: SetStatus.none,
      isEdit: false,
    },
  })

  res.status(StatusCode.OK).json({
    msg: 'ok', 
    online: onlinePages.length,
    offline: offline.count,
  })
}
