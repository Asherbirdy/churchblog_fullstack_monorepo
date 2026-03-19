import { useRequestApi } from '~/composables'
import { PublicRequestUrl, UserRequestUrl } from '~/enum'

interface LoginResponse {
  user: {
    id: string
    name: string
    email: string
  }
  token: {
    accessTokenJWT: string
    refreshTokenJWT: string
  }
}

export const useAuthApi = {
  login: async (body: { email: string, password: string }) => {
    return await useRequestApi<LoginResponse, null>(PublicRequestUrl.AuthLogin, {
      method: 'POST',
      body,
      server: false,
      lazy: true,
      immediate: false,
      watch: false
    })
  },
  logout: async () => {
    return await useRequestApi(UserRequestUrl.AuthLogout, {
      method: 'DELETE'
    })
  },
  refreshToken: async () => {
    return await useRequestApi(UserRequestUrl.AuthRefreshToken, {
      method: 'POST'
    })
  },
  checkValidToken: async () => {
    return await useRequestApi(UserRequestUrl.AuthCheckValidToken, {
      method: 'GET'
    })
  },
  sendVerificationEmail: async (body: { email: string }) => {
    return await useRequestApi(UserRequestUrl.AuthSendVerificationEmail, {
      method: 'POST',
      body,
      server: false,
      lazy: true,
      immediate: false,
      watch: false
    })
  },
  changePasswordWithOTP: async (body: { otp: string, newPassword: string }) => {
    return await useRequestApi(UserRequestUrl.AuthChangePasswordWithOTP, {
      method: 'POST',
      body,
      server: false,
      lazy: true,
      immediate: false,
      watch: false
    })
  }
}
