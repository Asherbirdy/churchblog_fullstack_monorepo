import { Router } from 'express'
import { PageController } from '../controllers'
import { authenticateUser } from '../middleware'
const router = Router()

router.post('/', authenticateUser, PageController.create)
router.get('/', authenticateUser, PageController.getAll)
router.get('/:id', authenticateUser, PageController.getOne)
router.patch('/:id', authenticateUser, PageController.update)
router.delete('/:id', authenticateUser, PageController.delete)

export default router
