import { Router } from 'express'
import { ChatCardController } from '../controllers'
import { authAccess, authenticateUser } from '../middleware'
import { AccessEnum, Role } from '../enum'
const router = Router()

router.post('/',authenticateUser, authAccess(AccessEnum.PAGE), ChatCardController.create)
router.get('/',authenticateUser, authAccess(AccessEnum.PAGE), ChatCardController.getAll)
router.get('/:id',authenticateUser, authAccess(AccessEnum.PAGE), ChatCardController.getOne)
router.patch('/:id',authenticateUser, authAccess(AccessEnum.PAGE), ChatCardController.update)
router.delete('/:id',authenticateUser, authAccess(AccessEnum.PAGE), ChatCardController.delete)

export default router
