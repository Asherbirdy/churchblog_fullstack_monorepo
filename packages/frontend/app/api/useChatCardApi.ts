import { useRequestApi } from '~/composables'
import { UserRequestUrl } from '~/enum'
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
  name?: string
  url?: string
  description?: string
  online?: boolean
}

export const useChatCardApi = {
  getAll: async () => {
    return await useRequestApi<GetAllChatCardsResponse, never>(
      UserRequestUrl.ChatCard, {
        method: 'GET',
        server: false,
        lazy: false
      })
  },
  getOne: async (id: string) => {
    return await useRequestApi<GetChatCardResponse, never>(
      `${UserRequestUrl.ChatCard}/${id}`, {
        method: 'GET',
        server: false,
        lazy: false
      })
  },
  create: async (payload: CreateChatCardPayload | Ref<CreateChatCardPayload>) => {
    return await useRequestApi<GetChatCardResponse, never>(
      UserRequestUrl.ChatCard, {
        method: 'POST',
        body: payload,
        immediate: false,
        server: false,
        watch: false,
        lazy: true
      })
  },
  update: async (id: string | Ref<string>, payload: UpdateChatCardPayload | Ref<UpdateChatCardPayload>) => {
    const url = computed(() => `${UserRequestUrl.ChatCard}/${unref(id)}`)
    return await useRequestApi<GetChatCardResponse, never>(
      url, {
        method: 'PATCH',
        body: payload,
        immediate: false,
        server: false,
        watch: false,
        lazy: true
      })
  },
  delete: async (id: string | Ref<string>) => {
    const url = computed(() => `${UserRequestUrl.ChatCard}/${unref(id)}`)
    return await useRequestApi(
      url, {
        method: 'DELETE',
        immediate: false,
        server: false,
        watch: false,
        lazy: true
      })
  }
}
