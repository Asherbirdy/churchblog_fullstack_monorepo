import { useApiRequest } from "./http"
export interface SendMessageResponse {
  found: boolean
  chatTopics: ChatTopic[]
}

export interface ChatTopic {
  id: string
  name: string
  keywords: string[]
  createdAt: string
  updatedAt: string
  cards: Card[]
}

export interface Card {
  id: string
  name: string
  url: string
  description: string
  chatTopicId: string
  createdAt: string
  updatedAt: string
  online: boolean
}



export const useMessageApi = {
  sendMessage: (payload: {message: string}): Promise<SendMessageResponse> => {
    return useApiRequest.post({
      url: `/chat/send-message`,
      data: payload
    })
  }
}
