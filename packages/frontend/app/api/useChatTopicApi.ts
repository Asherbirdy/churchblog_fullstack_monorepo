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

interface CreateChatCardPayload {
  name: string
  keywords: string[]
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
        lazy: false,
        key: `${UserRequestUrl.ChatTopic}-${id}`
      })
  },
  create: async (payload: Ref<CreateChatCardPayload>) => {
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
  update: async (payload: Ref<UpdateChatTopicPayload>) => {
    return await useRequestApi<GetChatTopicResponse, never>(
      computed(() => `${UserRequestUrl.ChatTopic}/${payload.value.id}`), {
        method: 'PATCH',
        body: payload,
        immediate: false,
        server: false,
        watch: false,
        lazy: true
      })
  },
  delete: async (id: Ref<string>) => {
    return await useRequestApi(
      computed(() => `${UserRequestUrl.ChatTopic}/${id.value}`), {
        method: 'DELETE',
        immediate: false,
        server: false,
        watch: false,
        lazy: false
      })
  }
}
