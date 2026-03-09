import { RegisterController } from './RegisterController'
import { LoginController } from './LoginController'
import { LogoutController } from './LogoutController'

export const AuthController = {
  register: RegisterController,
  login: LoginController,
  logout: LogoutController,
}
