import { Router } from 'express'
import { AccountController } from '../controllers'
import { authenticateUser, authorizePermission } from '../middleware'
import { Role } from '../enum'

const router = Router()

router.post(
  '/adminRegisterUser',
  authenticateUser,
  authorizePermission(Role.admin),
  AccountController.adminRegisterUser
)

router.delete(
  '/deleteUser/:id',
  authenticateUser,
  authorizePermission(Role.admin),
  AccountController.deleteUser
)

router.post(
  '/sendVerificationEmail',
  authenticateUser,
  authorizePermission(Role.admin),
  AccountController.sendVerificationEmail
)

router.post(
  '/changePasswordWithOTP',
  authenticateUser,
  AccountController.changePasswordWithOTP
)

export default router
