import { create } from 'zustand'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
}

interface MessageStore {
  messages: Message[]
  addMessage: (text: string, sender: Message['sender']) => void
  clearMessages: () => void
}

const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  addMessage: (text, sender) =>
    set((state) => ({
      messages: [... state.messages, { id: `${ Date.now() }`, text, sender }],
    })),
  clearMessages: () => set({ messages: [] }),
}))

export { useMessageStore }
export type { Message }
