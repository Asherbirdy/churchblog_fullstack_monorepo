import { useRequestApi } from '~/composables'
import { PublicRequestUrl, UserRequestUrl } from '~/enum'

export interface GetAllUserResponse {
  users: User[]
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  access: string[]
  isBlocked: boolean
  createdAt: string
  updatedAt: string
}

export const useAccountApi = {
  adminInit: async (body: { name: string, email: string, password: string }) => {
    return await useRequestApi(PublicRequestUrl.AccountAdminInit, {
      method: 'POST',
      body
    })
  },
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
  editAccess: async (body: Ref<{ userId: string, access: string[] }>) => {
    return await useRequestApi(UserRequestUrl.AccountEditAccess, {
      method: 'PATCH',
      body,
      server: false,
      lazy: true,
      immediate: false,
      watch: false
    })
  },
  getAllUser: async () => {
    return await useRequestApi<GetAllUserResponse, never>(UserRequestUrl.AccountGetAllUser, {
      method: 'GET',
      server: false,
      lazy: true,
      key: UserRequestUrl.AccountGetAllUser,
      getCachedData: key => useNuxtApp().payload.data[key] || useNuxtApp().static.data[key]
    })
  }
}
