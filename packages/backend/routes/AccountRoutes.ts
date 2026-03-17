import { Router } from 'express'
import { AccountController } from '../controllers'
import { authenticateUser } from '../middleware'
const router = Router()

router.post('/adminRegisterUser', authenticateUser, AccountController.adminRegisterUser)

export default router
