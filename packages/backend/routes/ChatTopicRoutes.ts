import { Router } from 'express'
import { ChatTopicController } from '../controllers'

const router = Router()

router.post('/', ChatTopicController.create)
router.get('/', ChatTopicController.getAll)
router.get('/:id', ChatTopicController.getOne)
router.patch('/:id', ChatTopicController.update)
router.delete('/:id', ChatTopicController.delete)

export default router
