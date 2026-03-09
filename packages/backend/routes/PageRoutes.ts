import { Router } from 'express'
import { PageController } from '../controllers'
import { authenticateUser } from '../middleware'
const router = Router()

router.post('/', authenticateUser, PageController.create)
router.get('/', authenticateUser, PageController.getAll)
router.patch('/:id', authenticateUser, PageController.update)

export default router
