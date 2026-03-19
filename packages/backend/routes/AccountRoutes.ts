import { Router } from 'express'
import { AccountController } from '../controllers'
import { authenticateUser, authorizePermission } from '../middleware'
import { Role } from '../enum'

const router = Router()

router.post(
  '/adminInit',
  AccountController.adminInit
)

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

router.get(
  '/getAllUser',
  authenticateUser,
  authorizePermission(Role.admin),
  AccountController.getAllUser
)

export default router
