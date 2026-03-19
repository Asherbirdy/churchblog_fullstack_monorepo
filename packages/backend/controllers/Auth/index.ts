import { ChangePasswordWithOTPController } from './ChangePasswordWithOTPController'
import { CheckValidTokenController } from './CheckValidTokenController'
import { LoginController } from './LoginController'
import { LogoutController } from './LogoutController'
import { RefreshTokenController } from './RefreshTokenController'
import { SendVerificationEmailController } from './SendVerificationEmailController'

export const AuthController = {
  changePasswordWithOTP: ChangePasswordWithOTPController,
  checkValidToken: CheckValidTokenController,
  login: LoginController,
  logout: LogoutController,
  refreshToken: RefreshTokenController,
  sendVerificationEmail: SendVerificationEmailController,
}
