import { RegisterController } from './RegisterController'
import { LoginController } from './LoginController'
import { LogoutController } from './LogoutController'
import { RefreshTokenController } from './RefreshTokenController'
import { CheckValidTokenController } from './CheckValidTokenController'

export const AuthController = {
  register: RegisterController,
  login: LoginController,
  logout: LogoutController,
  refreshToken: RefreshTokenController,
  checkValidToken: CheckValidTokenController,
}
