import { AxiosPromise } from 'axios'
import { PrivateApiRoute } from '@/enums'
import { useApiRequest } from './http'

export interface ChatCard {
  id: string
  name: string
  url: string
  description: string
  online: boolean
  chatTopicId: string
  createdAt: string
  updatedAt: string
}

export interface ChatTopic {
  id: string
  name: string
  keywords: string[]
  cards: ChatCard[]
  createdAt: string
  updatedAt: string
}

export interface GetAllChatTopicsResponse {
  chatTopics: ChatTopic[]
}

export interface GetChatTopicResponse {
  chatTopic: ChatTopic
}

export interface UpdateChatTopicPayload {
  id: string
  name?: string
  keywords?: string[]
}

export interface CreateChatTopicError {
  data: {
    success: boolean
    error: 'CHAT_TOPIC_NAME_ALREADY_EXISTS'
  }
}

export interface CreateChatTopicPayload {
  name: string
  keywords: string[]
}

export const useChatTopicApi = {
  create: (payload: CreateChatTopicPayload): AxiosPromise<GetChatTopicResponse> => {
    return useApiRequest.post({ url: PrivateApiRoute.ChatTopic, data: payload })
  },
  getAll: (params?: { page?: number; limit?: number }): AxiosPromise<GetAllChatTopicsResponse> => {
    return useApiRequest.get({ url: PrivateApiRoute.ChatTopic, params })
  },
  getOne: (id: string | number): AxiosPromise<GetChatTopicResponse> => {
    return useApiRequest.get({ url: `${PrivateApiRoute.ChatTopic}/${id}` })
  },
  update: (id: string | number, payload: UpdateChatTopicPayload): AxiosPromise<GetChatTopicResponse> => {
    return useApiRequest.patch({ url: `${PrivateApiRoute.ChatTopic}/${id}`, data: payload })
  },
  delete: (id: string | number): AxiosPromise<any> => {
    return useApiRequest.delete({ url: `${PrivateApiRoute.ChatTopic}/${id}` })
  },
}
