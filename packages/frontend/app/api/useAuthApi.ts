import { useRequestApi } from '~/composables'
import { PublicRequestUrl, UserRequestUrl } from '~/enum'

export const useAuthApi = {
  register: async (body: { name: string, email: string, password: string }) => {
    return await useRequestApi(PublicRequestUrl.AuthRegister, {
      method: 'POST',
      body,
    })
  },
  login: async (body: { email: string, password: string }) => {
    return await useRequestApi(PublicRequestUrl.AuthLogin, {
      method: 'POST',
      body,
    })
  },
  logout: async () => {
    return await useRequestApi(UserRequestUrl.AuthLogout, {
      method: 'DELETE',
    })
  },
  refreshToken: async () => {
    return await useRequestApi(UserRequestUrl.AuthRefreshToken, {
      method: 'POST',
    })
  },
}
