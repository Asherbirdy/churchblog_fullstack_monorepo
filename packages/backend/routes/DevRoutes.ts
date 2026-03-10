import { Router } from 'express'
import { DevController } from '../controllers'

const router = Router()

router.get('/check-ip', DevController.checkIp)

export default router
