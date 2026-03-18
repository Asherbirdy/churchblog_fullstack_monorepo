import { AdminRegisterUserController } from './AdminRegisterUserController'
import { ChangePasswordWithOTPController } from './ChangePasswordWithOTPController'
import { DeleteUserAccountController } from './DeleteUserAccountController'
import { GetAllUserController } from './GetAllUserController'
import { SendVerificationEmailController } from './SendVerificationEmailController'

export const AccountController = {
  adminRegisterUser: AdminRegisterUserController,
  changePasswordWithOTP: ChangePasswordWithOTPController,
  deleteUser: DeleteUserAccountController,
  getAllUser: GetAllUserController,
  sendVerificationEmail: SendVerificationEmailController,
}
