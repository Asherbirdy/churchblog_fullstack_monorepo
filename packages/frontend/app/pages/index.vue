<script setup lang="ts">
import { Chatroom } from '~/components'
import { PublicRoutes } from '~/enum'

const toolCards = [
  {
    title: '生命讀經每日分配',
    desc: '管理生命讀經的每日分配',
    icon: 'i-lucide-book-open',
    color: 'bg-sage-100',
    textColor: 'text-sage-800',
    size: 'normal',
    route: PublicRoutes.LIFE_BIBLE_STUDY
  }
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <div class="flex flex-col lg:flex-row gap-10">
      <div class="flex-1 min-w-0">
        <div class="mb-8 animate-fade-up">
          <h1 class="font-display text-4xl md:text-5xl font-bold text-sand-950 leading-tight">
            你的話是我腳前的燈<br>是我路上的光
          </h1>
          <p class="text-sm text-sand-400 mt-2">
            — 詩篇 119:105
          </p>
        </div>

        <div class="grid grid-cols-3 gap-4 animate-fade-up stagger-2">
          <NuxtLink
            v-for="(card, index) in toolCards"
            :key="card.title"
            :to="card.route"
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
            <div>
              <p :class="['text-sm font-semibold leading-snug', card.textColor]">
                {{ card.title }}
              </p>
              <p :class="['text-[11px] mt-1 opacity-70', card.textColor]">
                {{ card.desc }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div class="w-full lg:w-[380px] shrink-0 animate-fade-up stagger-3 lg:sticky lg:top-6 lg:self-start">
        <Chatroom />
      </div>
    </div>
  </div>
</template>
