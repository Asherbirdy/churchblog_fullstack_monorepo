import { CreatePageController } from './CreatePageController'
import { GetAllPagesController } from './GetAllPagesController'
import { GetPageController } from './GetPageController'
import { UpdatePageController } from './UpdatePageController'
import { DeletePageController } from './DeletePageController'

export const PageController = {
  create: CreatePageController,
  getAll: GetAllPagesController,
  getOne: GetPageController,
  update: UpdatePageController,
  delete: DeletePageController,
}
