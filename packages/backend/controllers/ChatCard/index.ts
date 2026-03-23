import { CreateChatCardController } from './CreateChatCardController'
import { GetAllChatCardsController } from './GetAllChatCardsController'
import { GetChatCardController } from './GetChatCardController'
import { UpdateChatCardController } from './UpdateChatCardController'
import { DeleteChatCardController } from './DeleteChatCardController'

export const ChatCardController = {
  create: CreateChatCardController,
  getAll: GetAllChatCardsController,
  getOne: GetChatCardController,
  update: UpdateChatCardController,
  delete: DeleteChatCardController,
}
