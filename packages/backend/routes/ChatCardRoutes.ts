import { Router } from 'express'
import { ChatCardController } from '../controllers'

const router = Router()

router.post('/', ChatCardController.create)
router.get('/', ChatCardController.getAll)
router.get('/:id', ChatCardController.getOne)
router.patch('/:id', ChatCardController.update)
router.delete('/:id', ChatCardController.delete)

export default router
