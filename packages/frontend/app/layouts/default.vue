<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.svg' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap' },
    { rel: 'stylesheet', href: '/chatbot/chatbot.css' }
  ],
  script: [
    {
      src: '/chatbot/index.min.js',
      onload: () => window.Chatbot?.init()
    }
  ],
  htmlAttrs: {
    lang: 'zh-TW'
  }
})

const title = '小羊天地'
const description = ''

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
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
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-sand-200 bg-sand-50">
      <div class="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-sand-400">
          &copy; {{ new Date().getFullYear() }} 小羊天地
        </p>
      </div>
    </footer>
  </div>
</template>
