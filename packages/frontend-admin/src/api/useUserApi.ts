import { AxiosPromise } from 'axios'
import { PrivateApiRoute } from '@/enums'
import { useApiRequest } from './http'

export interface UserShowMeResponse {
  msg: string
  user: UserShowMe
}

export interface UserShowMe {
  id: string
  name: string
  email: string
  access: string[]
  role: string
}

export const useUserApi = {
  showCurrentUser: (): AxiosPromise<UserShowMeResponse> => {
    return useApiRequest.get({ url: PrivateApiRoute.UserShowMe })
  },
}
