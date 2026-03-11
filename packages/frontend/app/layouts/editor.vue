<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-sand-50">
    <!-- Header -->
    <header class="sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-xl border-b border-sand-200 flex items-center px-4">
      <button
        class="flex items-center gap-1.5 text-sand-600 hover:text-sand-950 transition-colors"
        @click="router.back()"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="text-lg"
        />
        <span class="text-sm font-medium">
          返回
        </span>
      </button>
    </header>

    <!-- Content -->
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
