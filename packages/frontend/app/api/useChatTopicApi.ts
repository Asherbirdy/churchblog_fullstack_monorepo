import { useRequestApi } from '~/composables'
import { UserRequestUrl } from '~/enum'

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

export interface CreateChatTopicError {
  data: {
    success: boolean
    error: 'CHAT_TOPIC_NAME_ALREADY_EXISTS'
  }
}

export const useChatTopicApi = {
  getAll: async () => {
    const nuxtApp = useNuxtApp()
    return await useRequestApi<GetAllChatTopicsResponse, never>(
      UserRequestUrl.ChatTopic, {
        method: 'GET',
        server: false,
        lazy: false,
        key: UserRequestUrl.ChatTopic,
        getCachedData: key => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      })
  },
  getOne: async (id: string) => {
    return await useRequestApi<GetChatTopicResponse, never>(
      `${UserRequestUrl.ChatTopic}/${id}`, {
        method: 'GET',
        server: false,
        lazy: false
      })
  },
  create: async (payload: { name: string, keywords: string[] }) => {
    return await useRequestApi<GetChatTopicResponse, CreateChatTopicError>(
      UserRequestUrl.ChatTopic, {
        method: 'POST',
        body: payload,
        immediate: false,
        server: false,
        watch: false,
        lazy: true
      })
  },
  update: async (id: string, payload: { name?: string, keywords?: string[] }) => {
    return await useRequestApi<GetChatTopicResponse, never>(
      `${UserRequestUrl.ChatTopic}/${id}`, {
        method: 'PATCH',
        body: payload,
        immediate: false,
        server: false,
        watch: false,
        lazy: true
      })
  },
  delete: async (id: string) => {
    return await useRequestApi(
      `${UserRequestUrl.ChatTopic}/${id}`, {
        method: 'DELETE',
        immediate: false,
        server: false,
        watch: false,
        lazy: true
      })
  }
}
