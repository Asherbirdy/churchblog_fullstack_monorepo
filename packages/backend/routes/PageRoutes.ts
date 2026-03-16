import { Router } from 'express'
import { PageController } from '../controllers'
import { authenticateUser, authorizePermission } from '../middleware'
import { Role } from '../enum'
const router = Router()

router.post('/', authenticateUser, PageController.create)
router.get('/', authenticateUser, PageController.getAll)
router.get('/info/:id', authenticateUser, PageController.getOne)
router.get('/online', PageController.getOnline)
router.get('/route/:routeName', PageController.getByRouteName)
router.patch('/update/:id', authenticateUser, PageController.update)
router.patch('/edited-html/:id', authenticateUser, PageController.editedHtml)
router.patch('/scheduled/:id', authenticateUser, PageController.scheduled)
router.patch('/cancel-scheduled/:id', authenticateUser, PageController.cancelScheduled)
router.patch('/reset', authenticateUser, authorizePermission(Role.admin), PageController.reset)

export default router
