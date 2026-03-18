import { AdminRegisterUserController } from './AdminRegisterUserController'
import { ChangePasswordWithOTPController } from './ChangePasswordWithOTPController'
import { DeleteUserAccountController } from './DeleteUserAccountController'
import { SendVerificationEmailController } from './SendVerificationEmailController'

export const AccountController = {
  adminRegisterUser: AdminRegisterUserController,
  changePasswordWithOTP: ChangePasswordWithOTPController,
  deleteUser: DeleteUserAccountController,
  sendVerificationEmail: SendVerificationEmailController,
}
