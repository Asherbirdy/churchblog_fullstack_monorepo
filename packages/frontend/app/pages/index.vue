<script setup lang="ts">
import { Chatroom } from '~/components'

const state = ref({
  data: {
    searchQuery: ''
  },
  feature: {}
})

const ministryCards = [
  {
    title: '主日崇拜',
    icon: 'i-lucide-heart',
    color: 'bg-sage-100',
    textColor: 'text-sage-800',
    size: 'normal'
  },
  {
    title: '小組團契',
    icon: 'i-lucide-users',
    color: 'bg-warm-100',
    textColor: 'text-warm-800',
    size: 'normal'
  },
  {
    title: '兒童主日學 & 青少年事工',
    icon: 'i-lucide-sparkles',
    color: 'bg-sand-950',
    textColor: 'text-white',
    size: 'wide'
  },
  {
    title: '敬拜團',
    icon: 'i-lucide-music',
    color: 'bg-sand-200',
    textColor: 'text-sand-800',
    size: 'normal'
  },
  {
    title: '關懷探訪',
    icon: 'i-lucide-hand-heart',
    color: 'bg-sage-200',
    textColor: 'text-sage-900',
    size: 'normal'
  }
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <div class="flex flex-col lg:flex-row gap-10">
      <!-- Left Column -->
      <div class="flex-1 min-w-0">
        <!-- Hero Text -->
        <div class="mb-8 animate-fade-up">
          <p class="text-sm font-medium text-warm-600 tracking-wide uppercase mb-3">
            歡迎來到小羊天地
          </p>
          <h1 class="font-display text-4xl md:text-5xl font-bold text-sand-950 leading-tight">
            在這裡找到你的<br>屬靈的家
          </h1>
        </div>

        <!-- Search Bar -->
        <div class="flex items-center gap-3 mb-10 animate-fade-up stagger-1">
          <UInput
            v-model="state.data.searchQuery"
            placeholder="搜尋聚會、活動、事工..."
            icon="i-lucide-search"
            size="lg"
            class="flex-1"
            :ui="{ base: 'rounded-xl bg-white border-sand-200' }"
          />
          <UButton
            label="搜尋"
            size="lg"
            class="rounded-xl bg-sand-950 text-white hover:bg-sand-800 px-6 shrink-0"
          />
        </div>

        <!-- Ministry Cards Grid -->
        <div class="grid grid-cols-3 gap-4 animate-fade-up stagger-2">
          <div
            v-for="(card, index) in ministryCards"
            :key="card.title"
            :class="[
              'rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
              card.color,
              card.size === 'wide' ? 'col-span-2 row-span-1' : '',
              index < 2 ? 'min-h-[140px]' : 'min-h-[130px]'
            ]"
          >
            <UIcon
              :name="card.icon"
              :class="['text-2xl mb-4', card.textColor]"
            />
            <p :class="['text-sm font-semibold leading-snug', card.textColor]">
              {{ card.title }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column - Chatroom -->
      <div class="w-full lg:w-[380px] shrink-0 animate-fade-up stagger-3">
        <Chatroom />
      </div>
    </div>
  </div>
</template>
