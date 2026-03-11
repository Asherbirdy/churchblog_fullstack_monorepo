import { CreatePageController } from './CreatePageController'
import { GetAllPagesController } from './GetAllPagesController'
import { ResetPageController } from './ResetPageController'
import { UpdatePageController } from './UpdatePageController'

export const PageController = {
  create: CreatePageController,
  getAll: GetAllPagesController,
  reset: ResetPageController,
  update: UpdatePageController,
}
