import { CreatePageController } from './CreatePageController'
import { GetAllPagesController } from './GetAllPagesController'
import { GetPageInfoController } from './GetPageInfoController'
import { ResetPageController } from './ResetPageController'
import { UpdatePageController } from './UpdatePageController'

export const PageController = {
  create: CreatePageController,
  getAll: GetAllPagesController,
  getOne: GetPageInfoController,
  reset: ResetPageController,
  update: UpdatePageController,
}
