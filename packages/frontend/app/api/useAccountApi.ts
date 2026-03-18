import { useRequestApi } from '~/composables'
import { UserRequestUrl } from '~/enum'

export const useAccountApi = {
  adminRegisterUser: async (body: { name: string, email: string, password: string }) => {
    return await useRequestApi(UserRequestUrl.AccountAdminRegisterUser, {
      method: 'POST',
      body,
      server: false,
      lazy: true,
      immediate: false,
      watch: false
    })
  },
  deleteUser: async (id: string) => {
    return await useRequestApi(`${UserRequestUrl.AccountDeleteUser}/${id}`, {
      method: 'DELETE',
      server: false,
      lazy: true,
      immediate: false,
      watch: false
    })
  },
  sendVerificationEmail: async (body: { email: string }) => {
    return await useRequestApi(UserRequestUrl.AccountSendVerificationEmail, {
      method: 'POST',
      body,
      server: false,
      lazy: true,
      immediate: false,
      watch: false
    })
  },
  changePasswordWithOTP: async (body: { otp: string, newPassword: string }) => {
    return await useRequestApi(UserRequestUrl.AccountChangePasswordWithOTP, {
      method: 'POST',
      body,
      server: false,
      lazy: true,
      immediate: false,
      watch: false
    })
  },
  getAllUser: async () => {
    return await useRequestApi(UserRequestUrl.AccountGetAllUser, {
      method: 'GET',
      server: false,
      lazy: true,
      immediate: false,
      watch: false
    })
  }
}
