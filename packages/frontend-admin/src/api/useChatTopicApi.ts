import { AxiosPromise } from 'axios'
import { PrivateApiRoute } from '@/enums'
import { useApiRequest } from './http'

export const useChatTopicApi = {
  create: (payload: any): AxiosPromise<any> => {
    return useApiRequest.post({ url: PrivateApiRoute.ChatTopic, data: payload })
  },
  getAll: (params?: any): AxiosPromise<any> => {
    return useApiRequest.get({ url: PrivateApiRoute.ChatTopic, params })
  },
  getOne: (id: string | number): AxiosPromise<any> => {
    return useApiRequest.get({ url: `${PrivateApiRoute.ChatTopic}/${id}` })
  },
  update: (id: string | number, payload: any): AxiosPromise<any> => {
    return useApiRequest.patch({ url: `${PrivateApiRoute.ChatTopic}/${id}`, data: payload })
  },
  delete: (id: string | number): AxiosPromise<any> => {
    return useApiRequest.delete({ url: `${PrivateApiRoute.ChatTopic}/${id}` })
  },
}
