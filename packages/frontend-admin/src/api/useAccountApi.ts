import { AxiosPromise } from 'axios'
import { PrivateApiRoute, PublicApiRoute } from '@/enums'
import { useApiRequest } from './http'

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

export interface AccountAdminInitPayload {
  name: string
  email: string
  password: string
}

export interface AccountEditAccessPayload {
  userId: string
  access: string[]
}

export const useAccountApi = {
  adminInit: (payload: AccountAdminInitPayload) => {
    return useApiRequest.post({
      url: PublicApiRoute.AccountAdminInit,
      data: payload,
    })
  },
  adminRegisterUser: (payload: AccountAdminInitPayload) => {
    return useApiRequest.post({
      url: PrivateApiRoute.AccountAdminRegister,
      data: payload,
    })
  },
  deleteUser: (id: string | number) => {
    return useApiRequest.delete({ url: `${PrivateApiRoute.AccountDeleteUser}/${id}` })
  },
  getAllUser: (params?: any): AxiosPromise<GetAllUserResponse> => {
    return useApiRequest.get({
      url: PrivateApiRoute.AccountGetAllUser,
      params,
    })
  },
  editAccess: (payload: AccountEditAccessPayload) => {
    return useApiRequest.patch({
      url: PrivateApiRoute.AccountEditAccess,
      data: payload,
    })
  },
}
