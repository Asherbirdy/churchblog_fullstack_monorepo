import { Router } from 'express'
import { PageController } from '../controllers'
import { authAccess, authenticateUser, authorizePermission } from '../middleware'
import { AccessEnum, Role } from '../enum'

const router = Router()

router.post('/', authenticateUser, authAccess(AccessEnum.PAGE), PageController.create)
router.get('/', authenticateUser, PageController.getAll)
router.get('/info/:id', authenticateUser, authAccess(AccessEnum.PAGE), PageController.getOne)
router.get('/online', PageController.getOnline)
router.get('/route/:routeName', PageController.getByRouteName)
router.patch('/update/:id', authenticateUser, authAccess(AccessEnum.PAGE), PageController.update)
router.patch('/edited-html/:id', authenticateUser, authAccess(AccessEnum.PAGE), PageController.editedHtml)
router.patch('/set-to-online-scheduled/:id', authenticateUser, authAccess(AccessEnum.PAGE), PageController.setToOnlineScheduled)
router.patch('/cancel-scheduled/:id', authenticateUser, authAccess(AccessEnum.PAGE), PageController.cancelScheduled)
router.patch('/set-to-offline-scheduled/:id', authenticateUser, authAccess(AccessEnum.PAGE), PageController.setToOfflineScheduled)
router.patch('/go-to-previous-html/:id', authenticateUser, authAccess(AccessEnum.PAGE), PageController.goToPreviousHtml)
router.patch('/before-build-and-deploy', authenticateUser, PageController.beforeBuildAndDeploy)
router.patch('/reset', authenticateUser, authorizePermission(Role.admin), PageController.reset)

export default router
