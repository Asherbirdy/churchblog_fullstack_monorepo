import { Router } from 'express'
import { ChatController } from '../controllers'

const router = Router()

router.post('/send-message', ChatController.sendMessage)

export default router
