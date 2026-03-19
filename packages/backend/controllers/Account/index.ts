import { RegisterFirstAdminController } from './RegisterFirstAdminController'
import { RegisterUserController } from './RegisterUserController'
import { ChangePasswordWithOTPController } from './ChangePasswordWithOTPController'
import { DeleteUserAccountController } from './DeleteUserAccountController'
import { GetAllUserController } from './GetAllUserController'
import { SendVerificationEmailController } from './SendVerificationEmailController'

export const AccountController = {
  adminInit: RegisterFirstAdminController,
  adminRegisterUser: RegisterUserController,
  changePasswordWithOTP: ChangePasswordWithOTPController,
  deleteUser: DeleteUserAccountController,
  getAllUser: GetAllUserController,
  sendVerificationEmail: SendVerificationEmailController,
}
