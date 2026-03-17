<script setup lang="ts">
const state = ref({
  data: {
    messages: [
      { role: 'bot' as const, text: '嗨！歡迎來到小羊天地 🐑 有任何關於教會的問題都可以問我喔！' }
    ],
    input: ''
  },
  feature: {
    isSending: false
  }
})

const messagesEnd = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    messagesEnd.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

const handleSend = async () => {
  const text = state.value.data.input.trim()
  if (!text || state.value.feature.isSending) return

  state.value.data.messages.push({ role: 'user', text })
  state.value.data.input = ''
  state.value.feature.isSending = true
  scrollToBottom()

  // TODO: replace with actual API call
  setTimeout(() => {
    state.value.data.messages.push({
      role: 'bot',
      text: '感謝你的提問！目前此功能正在開發中，之後會有專人為你解答。'
    })
    state.value.feature.isSending = false
    scrollToBottom()
  }, 1000)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="bg-white rounded-3xl border border-sand-200 p-6 shadow-sm flex flex-col h-[520px]">
    <!-- Title -->
    <div class="mb-4">
      <h2 class="font-display text-2xl font-bold text-sand-950 mb-1">
        有問題想問？
      </h2>
      <p class="text-sm text-sand-500">
        歡迎隨時提問，我們很樂意為你解答
      </p>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
      <div
        v-for="(msg, index) in state.data.messages"
        :key="index"
        :class="[
          'flex',
          msg.role === 'user' ? 'justify-end' : 'justify-start'
        ]"
      >
        <div
          :class="[
            'max-w-[80%] px-4 py-2.5 text-sm leading-relaxed',
            msg.role === 'user'
              ? 'bg-sage-600 text-white rounded-2xl rounded-br-md'
              : 'bg-sand-100 text-sand-800 rounded-2xl rounded-bl-md'
          ]"
        >
          {{ msg.text }}
        </div>
      </div>

      <!-- Typing indicator -->
      <div
        v-if="state.feature.isSending"
        class="flex justify-start"
      >
        <div class="bg-sand-100 text-sand-400 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
          正在輸入...
        </div>
      </div>

      <div ref="messagesEnd" />
    </div>

    <!-- Input -->
    <div class="flex items-center gap-2 pt-3 border-t border-sand-100">
      <UInput
        v-model="state.data.input"
        placeholder="輸入你的問題..."
        size="lg"
        class="flex-1"
        :ui="{ base: 'rounded-xl bg-sand-50 border-sand-200' }"
        @keydown="handleKeydown"
      />
      <UButton
        icon="i-lucide-send"
        size="lg"
        class="rounded-xl bg-sage-600 text-white hover:bg-sage-700 shrink-0"
        :disabled="!state.data.input.trim() || state.feature.isSending"
        @click="handleSend"
      />
    </div>
  </div>
</template>
