import { Router } from 'express'
import { AuthController } from '../controllers'
import { authenticateUser } from '../middleware'
const router = Router()

router.post('/userRegister', AuthController.register)
router.post('/login', AuthController.login)
router.delete('/logout', authenticateUser, AuthController.logout)
router.get('/refreshToken', AuthController.refreshToken)
router.get('/checkValidToken', authenticateUser, AuthController.checkValidToken)

export default router
