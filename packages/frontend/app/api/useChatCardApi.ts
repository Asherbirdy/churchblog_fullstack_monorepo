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
  update: async (id: Ref<string>, payload: UpdateChatCardPayload | Ref<UpdateChatCardPayload>) => {
    return await useRequestApi<GetChatCardResponse, never>(
      computed(() => `${UserRequestUrl.ChatCard}/${id.value}`), {
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
      computed(() => `${UserRequestUrl.ChatCard}/${id.value}`), {
        method: 'DELETE',
        immediate: false,
        server: false,
        watch: false,
        lazy: true
      })
  }
}
