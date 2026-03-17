import { AdminInitController } from './AdminInitController'
import { LoginController } from './LoginController'
import { LogoutController } from './LogoutController'
import { RefreshTokenController } from './RefreshTokenController'
import { CheckValidTokenController } from './CheckValidTokenController'

export const AuthController = {
  adminInit: AdminInitController,
  login: LoginController,
  logout: LogoutController,
  refreshToken: RefreshTokenController,
  checkValidToken: CheckValidTokenController,
}
