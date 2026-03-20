import { Router } from 'express'
import { AuthController } from '../controllers'
import { authenticateUser, authorizePermission } from '../middleware'
import { Role } from '../enum'

const router = Router()

router.post('/loginSendOtp', AuthController.loginSendOtp)
router.post('/login', AuthController.login)
router.delete('/logout', authenticateUser, AuthController.logout)
router.get('/refreshToken', AuthController.refreshToken)
router.get('/checkValidToken', authenticateUser, AuthController.checkValidToken)

router.post(
  '/sendVerificationEmail',
  authenticateUser,
  authorizePermission(Role.admin),
  AuthController.sendVerificationEmail
)

router.post(
  '/changePasswordWithOTP',
  authenticateUser,
  AuthController.changePasswordWithOTP
)

export default router
