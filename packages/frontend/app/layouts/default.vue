<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap' }
  ],
  htmlAttrs: {
    lang: 'zh-TW'
  }
})

const title = '小羊天地'
const description = '一個充滿愛與盼望的信仰社群，歡迎你回家。'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const navLinks = [
  { label: '關於我們', to: '/about' },
  { label: '聚會時間', to: '/services' },
  { label: '最新消息', to: '/news' }
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-sand-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-sand-50/80 backdrop-blur-xl border-b border-sand-200">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5 group"
        >
          <div class="w-8 h-8 bg-sand-950 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <UIcon
              name="i-lucide-church"
              class="text-white text-lg"
            />
          </div>
          <span class="font-display text-xl font-semibold text-sand-950 tracking-tight">小羊天地</span>
        </NuxtLink>

        <!-- Nav -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm font-medium text-sand-600 hover:text-sand-950 transition-colors"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- CTA -->
        <div class="flex items-center gap-3">
          <UButton
            label="線上奉獻"
            color="neutral"
            class="rounded-full bg-sand-950 text-white hover:bg-sand-800 px-5"
          />
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-sand-200 bg-sand-50">
      <div class="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-6 text-sm text-sand-500">
          <span>Facebook</span>
          <span class="text-sand-300">|</span>
          <span>Instagram</span>
          <span class="text-sand-300">|</span>
          <span>YouTube</span>
        </div>

        <p class="text-sm text-sand-400">
          &copy; {{ new Date().getFullYear() }} 小羊天地
        </p>
      </div>
    </footer>
  </div>
</template>
