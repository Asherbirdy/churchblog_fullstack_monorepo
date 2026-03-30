import { AxiosPromise } from 'axios'
import { PrivateApiRoute } from '@/enums'
import { useApiRequest } from './http'

import type { ChatCard } from './useChatTopicApi'

export interface GetAllChatCardsResponse {
  chatCards: ChatCard[]
}

export interface GetChatCardResponse {
  chatCard: ChatCard
}

export interface CreateChatCardPayload {
  name: string
  url: string
  description: string
  chatTopicId: string
}

export interface UpdateChatCardPayload {
  id: string
  name?: string
  url?: string
  description?: string
  online?: boolean
}

export const useChatCardApi = {
  create: (payload: CreateChatCardPayload): AxiosPromise<GetChatCardResponse> => {
    return useApiRequest.post({ url: PrivateApiRoute.ChatCard, data: payload })
  },
  getAll: (params?: any): AxiosPromise<GetAllChatCardsResponse> => {
    return useApiRequest.get({ url: PrivateApiRoute.ChatCard, params })
  },
  getOne: (id: string | number): AxiosPromise<GetChatCardResponse> => {
    return useApiRequest.get({ url: `${PrivateApiRoute.ChatCard}/${id}` })
  },
  update: (id: string | number, payload: UpdateChatCardPayload): AxiosPromise<GetChatCardResponse> => {
    return useApiRequest.patch({ url: `${PrivateApiRoute.ChatCard}/${id}`, data: payload })
  },
  delete: (id: string | number): AxiosPromise<any> => {
    return useApiRequest.delete({ url: `${PrivateApiRoute.ChatCard}/${id}` })
  },
}
