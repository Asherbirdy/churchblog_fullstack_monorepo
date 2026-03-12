import { Router } from 'express'
import { ImageFolderController } from '../controllers'
import { authenticateUser } from '../middleware'
const router = Router()

router.get('/', authenticateUser, ImageFolderController.getAll)

export default router
