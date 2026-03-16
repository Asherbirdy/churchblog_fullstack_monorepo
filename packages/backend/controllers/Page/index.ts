import { CreatePageController } from './CreatePageController'
import { EditedHtmlController } from './EditedHtmlController'
import { GoToPreviousHtmlController } from './GoToPreviousHtmlController'
import { GetAllPagesController } from './GetAllPagesController'
import { GetOnlinePageController } from './GetOnlinePageController'
import { GetPageByRouteNameController } from './GetPageByRouteNameController'
import { GetPageInfoController } from './GetPageInfoController'
import { ResetPageController } from './ResetPageController'
import { ScheduledPageController } from './ScheduledPageController'
import { CancelScheduledPageController } from './CancelScheduledPageController'
import { UpdatePageController } from './UpdatePageController'

export const PageController = {
  create: CreatePageController,
  editedHtml: EditedHtmlController,
  goToPreviousHtml: GoToPreviousHtmlController,
  getAll: GetAllPagesController,
  getByRouteName: GetPageByRouteNameController,
  getOnline: GetOnlinePageController,
  getOne: GetPageInfoController,
  reset: ResetPageController,
  scheduled: ScheduledPageController,
  cancelScheduled: CancelScheduledPageController,
  update: UpdatePageController,
}
