<script setup lang="ts">
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

interface SendMessageResponse {
  found: boolean
  chatTopics: {
    id: string
    name: string
    keywords: string[]
    cards: {
      id: string
      name: string
      url: string
      description: string
      online: boolean
    }[]
  }[]
}

const config = useRuntimeConfig()
const baseUrl = config.public.API_URL

const state = ref({
  data: {
    messages: [] as Message[]
  },
  feature: {
    open: false,
    input: '',
    loading: false
  }
})

const bodyRef = ref<HTMLDivElement>()

const scrollToBottom = () => {
  nextTick(() => {
    if (bodyRef.value) {
      bodyRef.value.scrollTop = bodyRef.value.scrollHeight
    }
  })
}

watch(() => state.value.data.messages.length, () => {
  scrollToBottom()
})

const addMessage = (text: string, sender: 'user' | 'bot') => {
  state.value.data.messages.push({
    id: `${Date.now()}`,
    type: 'text',
    text,
    sender
  })
}

const addCardsMessage = (cards: CardItem[]) => {
  state.value.data.messages.push({
    id: `${Date.now()}`,
    type: 'cards',
    cards,
    sender: 'bot'
  })
}

const handleSend = async () => {
  const { feature } = state.value
  const text = feature.input.trim()
  if (!text || feature.loading) return

  addMessage(text, 'user')
  feature.input = ''
  feature.loading = true

  try {
    const res = await $fetch<SendMessageResponse>(`${baseUrl}/chat/send-message`, {
      method: 'POST',
      body: { message: text }
    })

    const cards = res.chatTopics
      .flatMap(topic => topic.cards.filter(card => card.online))
      .map(({ name, url, description }) => ({ name, url, description }))

    if (!res.found || cards.length === 0) {
      addMessage('抱歉，找不到相關的內容。', 'bot')
      return
    }

    addCardsMessage(cards)
  } catch {
    addMessage('發送失敗，請稍後再試。', 'bot')
  } finally {
    feature.loading = false
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div
    class="chatbot-container"
    :class="state.feature.open ? 'chatbot-open' : 'chatbot-closed'"
  >
    <!-- Floating icon -->
    <button
      v-if="!state.feature.open"
      class="chatbot-icon"
      aria-label="開啟聊天室"
      @click="state.feature.open = true"
    >
      <span class="chatbot-icon-ping" />
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>

    <!-- Chat window -->
    <template v-else>
      <!-- Header -->
      <div class="chatbot-header">
        <div class="chatbot-header-dots" />
        <span class="chatbot-title">💬 找找網站</span>
        <button
          class="chatbot-close"
          @click="state.feature.open = false"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
            />
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
            />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div
        ref="bodyRef"
        class="chatbot-body"
      >
        <!-- Placeholder -->
        <div
          v-if="state.data.messages.length === 0"
          class="chatbot-placeholder"
        >
          <span class="chatbot-placeholder-emoji">🐑</span>
          <p>有什麼可以幫助您的嗎？</p>
        </div>

        <!-- Messages -->
        <div
          v-else
          class="chatbot-messages"
        >
          <div
            v-for="msg in state.data.messages"
            :key="msg.id"
            class="chatbot-msg"
            :class="`chatbot-msg-${msg.sender}`"
          >
            <!-- Cards -->
            <div
              v-if="msg.type === 'cards'"
              class="chatbot-cards"
            >
              <a
                v-for="(card, i) in msg.cards"
                :key="i"
                class="chatbot-card"
                :href="card.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="chatbot-card-name">{{ card.name }}</span>
                <span
                  v-if="card.description"
                  class="chatbot-card-desc"
                >{{ card.description }}</span>
                <span class="chatbot-card-url">{{ card.url }}</span>
              </a>
            </div>

            <!-- Text bubble -->
            <div
              v-else
              class="chatbot-msg-bubble"
            >
              {{ msg.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="chatbot-footer">
        <input
          v-model="state.feature.input"
          class="chatbot-input"
          type="text"
          :placeholder="state.feature.loading ? '等待回覆中...' : '輸入訊息...'"
          :disabled="state.feature.loading"
          @keydown="handleKeyDown"
        >
        <button
          class="chatbot-send"
          :disabled="state.feature.loading"
          @click="handleSend"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line
              x1="22"
              y1="2"
              x2="11"
              y2="13"
            />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

/* ===== Base ===== */
.chatbot-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: 'Patrick Hand', cursive, system-ui, sans-serif;
  overflow: visible;
  transition: width 0.3s ease, height 0.3s ease, border-radius 0.3s ease;
}

.chatbot-closed {
  width: 62px;
  height: 62px;
  border-radius: 50%;
}

.chatbot-open {
  width: 370px;
  height: 500px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: none;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/* ===== Floating icon ===== */
.chatbot-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #42b883;
  color: #fff;
  border: 2.5px solid #222;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    2px 2px 0 #222,
    0 4px 14px rgba(0, 0, 0, 0.15);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  animation: comic-float 3s ease-in-out infinite;
}

.chatbot-icon:hover {
  transform: translate(-2px, -2px) scale(1.05);
  box-shadow:
    4px 4px 0 #222,
    0 6px 20px rgba(0, 0, 0, 0.2);
}

.chatbot-icon:active {
  transform: translate(1px, 1px) scale(0.97);
  box-shadow: 1px 1px 0 #222;
}

/* Ping ring */
.chatbot-icon-ping {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid #42b883;
  animation: comic-ping 2.5s ease-out infinite;
  pointer-events: none;
}

@keyframes comic-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes comic-ping {
  0% { transform: scale(1); opacity: 0.6; }
  70% { transform: scale(1.35); opacity: 0; }
  100% { transform: scale(1.35); opacity: 0; }
}

/* ===== Header ===== */
.chatbot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: #42b883;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: none;
  position: relative;
  overflow: hidden;
}

/* Halftone dots overlay */
.chatbot-header-dots {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image: radial-gradient(circle, #fff 1px, transparent 1px);
  background-size: 8px 8px;
  pointer-events: none;
}

.chatbot-title {
  position: relative;
  z-index: 1;
}

.chatbot-close {
  background: none;
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  cursor: pointer;
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s, transform 0.2s;
  position: relative;
  z-index: 1;
}

.chatbot-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* ===== Message body ===== */
.chatbot-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background:
    repeating-linear-gradient(
      transparent,
      transparent 27px,
      #e5e5e5 27px,
      #e5e5e5 28px
    );
  background-color: #fff;
}

.chatbot-placeholder {
  text-align: center;
  margin-top: 32px;
  padding: 20px 24px;
  background: #fff;
  border: 2px dashed #bbb;
  border-radius: 16px;
  color: #888;
  font-size: 16px;
  position: relative;
}

.chatbot-placeholder-emoji {
  display: block;
  font-size: 36px;
  margin-bottom: 6px;
  animation: comic-bounce 2s ease-in-out infinite;
}

@keyframes comic-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-4px) rotate(-5deg); }
  75% { transform: translateY(-2px) rotate(3deg); }
}

/* ===== Messages ===== */
.chatbot-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chatbot-msg {
  display: flex;
}

.chatbot-msg-user {
  justify-content: flex-end;
}

.chatbot-msg-bot {
  justify-content: flex-start;
}

.chatbot-msg-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
}

.chatbot-msg-user .chatbot-msg-bubble {
  background: #42b883;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.chatbot-msg-bot .chatbot-msg-bubble {
  background: #f0f0f0;
  color: #222;
  border-bottom-left-radius: 4px;
}

/* ===== Cards ===== */
.chatbot-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 85%;
}

.chatbot-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 14px;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 14px;
  text-decoration: none;
  color: #222;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
}

.chatbot-card:hover {
  border-color: #42b883;
  box-shadow: 2px 2px 0 #a8e6cf;
  transform: translate(-1px, -1px);
}

.chatbot-card-name {
  font-size: 15px;
  font-weight: 700;
  color: #222;
}

.chatbot-card-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.chatbot-card-url {
  font-size: 12px;
  color: #42b883;
  word-break: break-all;
}

/* ===== Footer ===== */
.chatbot-footer {
  display: flex;
  padding: 12px 14px;
  border-top: none;
  gap: 8px;
  background: #fff;
}

.chatbot-input {
  flex: 1;
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 8px 14px;
  font-size: 15px;
  font-family: 'Patrick Hand', cursive, system-ui, sans-serif;
  outline: none;
  background: #fff;
  color: #222;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.chatbot-input:focus {
  border-color: #42b883;
  box-shadow: 2px 2px 0 #a8e6cf;
}

.chatbot-input::placeholder {
  color: #bbb;
}

.chatbot-send {
  background: #42b883;
  color: #fff;
  border: 2px solid #222;
  border-radius: 12px;
  padding: 8px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Patrick Hand', cursive;
  font-weight: 700;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 2px 2px 0 #222;
}

.chatbot-send:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 #222;
}

.chatbot-send:active {
  transform: translate(1px, 1px);
  box-shadow: 0 0 0 #222;
}

/* ===== Responsive ===== */
@media (max-width: 480px) {
  .chatbot-open {
    width: calc(100vw - 32px);
    height: calc(100vh - 120px);
  }
}
</style>
