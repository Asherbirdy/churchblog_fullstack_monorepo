import { CreateChatTopicController } from './CreateChatTopicController'
import { GetAllChatTopicsController } from './GetAllChatTopicsController'
import { GetChatTopicController } from './GetChatTopicController'
import { UpdateChatTopicController } from './UpdateChatTopicController'
import { DeleteChatTopicController } from './DeleteChatTopicController'

export const ChatTopicController = {
  create: CreateChatTopicController,
  getAll: GetAllChatTopicsController,
  getOne: GetChatTopicController,
  update: UpdateChatTopicController,
  delete: DeleteChatTopicController,
}
