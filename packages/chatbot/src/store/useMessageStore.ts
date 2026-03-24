import { create } from 'zustand'

interface CardItem {
  name: string
  url: string
  description: string
}

interface TextMessage {
  id: string
  type: 'text'
  text: string
  sender: 'user' | 'bot'
}

interface CardsMessage {
  id: string
  type: 'cards'
  cards: CardItem[]
  sender: 'bot'
}

type Message = TextMessage | CardsMessage

interface MessageStore {
  messages: Message[]
  addMessage: (text: string, sender: 'user' | 'bot') => void
  addCardsMessage: (cards: CardItem[]) => void
  clearMessages: () => void
}

const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  addMessage: (text, sender) =>
    set((state) => ({
      messages: [... state.messages, { id: `${ Date.now() }`, type: 'text', text, sender }],
    })),
  addCardsMessage: (cards) =>
    set((state) => ({
      messages: [... state.messages, { id: `${ Date.now() }`, type: 'cards', cards, sender: 'bot' }],
    })),
  clearMessages: () => set({ messages: [] }),
}))

export { useMessageStore }
export type { Message, TextMessage, CardsMessage, CardItem }
