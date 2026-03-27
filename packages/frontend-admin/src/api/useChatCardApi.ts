import { AxiosPromise } from 'axios'
import { PrivateApiRoute } from '@/enums'
import { useApiRequest } from './http'

export const useChatCardApi = {
  create: (payload: any): AxiosPromise<any> => {
    return useApiRequest.post({ url: PrivateApiRoute.ChatCard, data: payload })
  },
  getAll: (params?: any): AxiosPromise<any> => {
    return useApiRequest.get({ url: PrivateApiRoute.ChatCard, params })
  },
  getOne: (id: string | number): AxiosPromise<any> => {
    return useApiRequest.get({ url: `${PrivateApiRoute.ChatCard}/${id}` })
  },
  update: (id: string | number, payload: any): AxiosPromise<any> => {
    return useApiRequest.patch({ url: `${PrivateApiRoute.ChatCard}/${id}`, data: payload })
  },
  delete: (id: string | number): AxiosPromise<any> => {
    return useApiRequest.delete({ url: `${PrivateApiRoute.ChatCard}/${id}` })
  },
}
