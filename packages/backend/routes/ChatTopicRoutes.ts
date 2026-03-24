import { Router } from 'express'
import { ChatTopicController } from '../controllers'
import { authAccess, authenticateUser } from '../middleware'
import { AccessEnum } from '../enum'

const router = Router()

router.post('/', authenticateUser, authAccess(AccessEnum.PAGE), ChatTopicController.create)
router.get('/',authenticateUser, authAccess(AccessEnum.PAGE), ChatTopicController.getAll)
router.get('/:id',authenticateUser, authAccess(AccessEnum.PAGE), ChatTopicController.getOne)
router.patch('/:id', authenticateUser, authAccess(AccessEnum.PAGE), ChatTopicController.update)
router.delete('/:id', authenticateUser, authAccess(AccessEnum.PAGE), ChatTopicController.delete)

export default router
 