import { RegisterFirstAdminController } from './RegisterFirstAdminController'
import { RegisterUserController } from './RegisterUserController'
import { DeleteUserAccountController } from './DeleteUserAccountController'
import { GetAllUserController } from './GetAllUserController'

export const AccountController = {
  adminInit: RegisterFirstAdminController,
  adminRegisterUser: RegisterUserController,
  deleteUser: DeleteUserAccountController,
  getAllUser: GetAllUserController,
}
