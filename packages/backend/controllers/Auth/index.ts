import { RegisterController } from './RegisterController'
import { LoginController } from './LoginController'
import { LogoutController } from './LogoutController'
import { RefreshTokenController } from './RefreshTokenController'

export const AuthController = {
  register: RegisterController,
  login: LoginController,
  logout: LogoutController,
  refreshToken: RefreshTokenController,
}
