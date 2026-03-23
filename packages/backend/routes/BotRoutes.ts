import { Router } from 'express'
import { BotController } from '../controllers'

const router = Router()

router.post('/send-message', BotController.sendMessage)

export default router
