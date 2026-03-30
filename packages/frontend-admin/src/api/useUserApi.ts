import { AxiosPromise } from 'axios'
import { PrivateApiRoute } from '@/enums'
import { useApiRequest } from './http'

export const useUserApi = {
  showCurrentUser: (): AxiosPromise<any> => {
    return useApiRequest.get({ url: PrivateApiRoute.UserShowMe })
  },
}
