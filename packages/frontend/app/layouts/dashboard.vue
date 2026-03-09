<script setup lang="ts">
const sidebarCollapsed = ref(false)

const menuItems = [
  { label: '聊天機器人', icon: 'i-lucide-bot', to: '/admin/chatbot' },
  { label: '一頁網站', icon: 'i-lucide-layout-template', to: '/admin/website' }
]

const route = useRoute()
</script>

<template>
  <div class="min-h-screen flex bg-sand-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 h-screen bg-white border-r border-sand-200 flex flex-col z-40 transition-all duration-300',
        sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center gap-2.5 px-5 border-b border-sand-200 shrink-0">
        <div class="w-8 h-8 bg-sand-950 rounded-lg flex items-center justify-center shrink-0">
          <UIcon
            name="i-lucide-church"
            class="text-white text-lg"
          />
        </div>
        <span
          v-show="!sidebarCollapsed"
          class="font-display text-lg font-semibold text-sand-950 tracking-tight truncate"
        >
          小羊天地
        </span>
      </div>

      <!-- Menu -->
      <nav class="flex-1 py-4 px-3 space-y-1">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
            route.path.startsWith(item.to)
              ? 'bg-sage-50 text-sage-700'
              : 'text-sand-500 hover:bg-sand-100 hover:text-sand-800'
          ]"
        >
          <UIcon
            :name="item.icon"
            :class="[
              'text-lg shrink-0',
              route.path.startsWith(item.to) ? 'text-sage-600' : 'text-sand-400 group-hover:text-sand-600'
            ]"
          />
          <span
            v-show="!sidebarCollapsed"
            class="text-sm font-medium truncate"
          >
            {{ item.label }}
          </span>
        </NuxtLink>
      </nav>

      <!-- Collapse Toggle -->
      <div class="p-3 border-t border-sand-200">
        <button
          class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sand-400 hover:bg-sand-100 hover:text-sand-600 transition-all duration-200"
          @click="sidebarCollapsed = !sidebarCollapsed"
        >
          <UIcon
            :name="sidebarCollapsed ? 'i-lucide-chevrons-right' : 'i-lucide-chevrons-left'"
            class="text-lg"
          />
          <span
            v-show="!sidebarCollapsed"
            class="text-xs font-medium"
          >
            收合選單
          </span>
        </button>
      </div>
    </aside>

    <!-- Main Area -->
    <div
      :class="[
        'flex-1 flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'ml-[68px]' : 'ml-[240px]'
      ]"
    >
      <!-- Header -->
      <header class="sticky top-0 z-30 h-16 bg-sand-50/80 backdrop-blur-xl border-b border-sand-200 flex items-center justify-between px-6">
        <div class="flex items-center gap-3">
          <h1 class="text-lg font-semibold text-sand-950">
            {{ menuItems.find((item) => route.path.startsWith(item.to))?.label || '控制台' }}
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-bell"
            color="neutral"
            variant="ghost"
            class="text-sand-500"
          />
          <div class="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center">
            <UIcon
              name="i-lucide-user"
              class="text-sage-600"
            />
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
