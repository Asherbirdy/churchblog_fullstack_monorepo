import { BeforeBuildAndDeployController } from './BeforeBuildAndDeployController'
import { CreatePageController } from './CreatePageController'
import { EditedHtmlController } from './EditedHtmlController'
import { GoToPreviousHtmlController } from './GoToPreviousHtmlController'
import { GetAllPagesController } from './GetAllPagesController'
import { GetOnlinePageController } from './GetOnlinePageController'
import { GetPageByRouteNameController } from './GetPageByRouteNameController'
import { GetPageInfoController } from './GetPageInfoController'
import { ResetPageController } from './ResetPageController'
import { SetPageToOnlineController } from './SetPageToOnlineController'
import { CancelScheduledPageController } from './CancelScheduledPageController'
import { SetPageToOfflineController } from './SetPageToOfflineController'
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
  setToOnline: SetPageToOnlineController,
  cancelScheduled: CancelScheduledPageController,
  setToOffline: SetPageToOfflineController,
  update: UpdatePageController,
}
