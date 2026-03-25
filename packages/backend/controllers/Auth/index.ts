import { ChangePasswordWithOTPController } from './ChangePasswordWithOTPController'
import { CheckValidTokenController } from './CheckValidTokenController'
import { ForgetPasswordEmailOTPController } from './ForgetPasswordEmailOTPController'
import { LoginController } from './LoginController'
import { LoginSendOtpController } from './LoginSendOtpController'
import { LogoutController } from './LogoutController'
import { RefreshTokenController } from './RefreshTokenController'
import { SendVerificationEmailController } from './SendVerificationEmailController'

export const AuthController = {
  changePasswordWithOTP: ChangePasswordWithOTPController,
  checkValidToken: CheckValidTokenController,
  forgetPasswordEmailOTP: ForgetPasswordEmailOTPController,
  login: LoginController,
  loginSendOtp: LoginSendOtpController,
  logout: LogoutController,
  refreshToken: RefreshTokenController,
  sendVerificationEmail: SendVerificationEmailController,
}
