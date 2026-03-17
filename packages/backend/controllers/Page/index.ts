import { BeforeBuildAndDeployController } from './BeforeBuildAndDeployController'
import { CreatePageController } from './CreatePageController'
import { EditedHtmlController } from './EditedHtmlController'
import { GoToPreviousHtmlController } from './GoToPreviousHtmlController'
import { GetAllPagesController } from './GetAllPagesController'
import { GetOnlinePageController } from './GetOnlinePageController'
import { GetPageByRouteNameController } from './GetPageByRouteNameController'
import { GetPageInfoController } from './GetPageInfoController'
import { ResetPageController } from './ResetPageController'
import { SetPageToOnlineScheduledController } from './SetPageToOnlineScheduledController'
import { CancelScheduledPageController } from './CancelScheduledPageController'
import { SetPageToOfflineScheduledController } from './SetPageToOfflineScheduledController'
import { UpdatePageController } from './UpdatePageController'

export const PageController = {
  beforeBuildAndDeploy: BeforeBuildAndDeployController,
  create: CreatePageController,
  editedHtml: EditedHtmlController,
  goToPreviousHtml: GoToPreviousHtmlController,
  getAll: GetAllPagesController,
  getByRouteName: GetPageByRouteNameController,
  getOnline: GetOnlinePageController,
  getOne: GetPageInfoController,
  reset: ResetPageController,
  setToOnlineScheduled: SetPageToOnlineScheduledController,
  cancelScheduled: CancelScheduledPageController,
  setToOfflineScheduled: SetPageToOfflineScheduledController,
  update: UpdatePageController,
}
