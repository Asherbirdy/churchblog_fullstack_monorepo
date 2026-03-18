import { AdminRegisterUserController } from './AdminRegisterUserController'
import { DeleteUserAccountController } from './DeleteUserAccountController'
import { SendVerificationEmailController } from './SendVerificationEmailController'

export const AccountController = {
  adminRegisterUser: AdminRegisterUserController,
  deleteUser: DeleteUserAccountController,
  sendVerificationEmail: SendVerificationEmailController,
}
