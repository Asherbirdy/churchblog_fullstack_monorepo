<script setup lang="ts">
import { usePageApi } from '~/api'
import { AddWebsiteButton } from '~/components'

const state = ref({
  data: {},
  feature: {
    activeTab: 'online'
  }
})

const { data, status } = await usePageApi.getAll()
const pages = computed(() => data.value?.pages ?? [])

const tabs = [
  { key: 'online', label: '上線中' },
  { key: 'offline', label: '未上線' },
  { key: 'scheduledOnline', label: '安排上線中' },
  { key: 'scheduledOffline', label: '安排下線中' }
]

const statusMap: Record<string, { label: string, dotClass: string }> = {
  online: { label: '上線中', dotClass: 'bg-emerald-500' },
  offline: { label: '未上線', dotClass: 'bg-sand-300' }
}

const getStatus = (status: string) => statusMap[status] || statusMap.offline

const filteredPages = computed(() => {
  const tab = state.value.feature.activeTab
  if (tab === 'scheduledOnline' || tab === 'scheduledOffline') {
    return pages.value.filter((p: { setStatus: string }) => p.setStatus === tab)
  }
  return pages.value.filter((p: { status: string }) => p.status === tab)
})
</script>

<template>
  <div class="max-w-4xl animate-fade-up">
    <!-- Page Title -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h2 class="font-display text-2xl font-bold text-sand-950 mb-1">
          一頁網站
        </h2>
        <p class="text-sm text-sand-500">
          管理你的一頁網站
        </p>
      </div>
      <AddWebsiteButton :disabled="status === 'pending'" />
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 bg-sand-100 rounded-xl p-1 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
        :class="state.feature.activeTab === tab.key
          ? 'bg-white text-sand-950 shadow-sm'
          : 'text-sand-500 hover:text-sand-700'"
        @click="state.feature.activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Page List -->
    <div class="space-y-3">
      <div
        v-for="page in filteredPages"
        :key="page.id"
        class="bg-white rounded-2xl border border-sand-200 shadow-sm hover:shadow-md transition-shadow px-5 py-4 flex items-center justify-between"
      >
        <!-- Left: Name -->
        <p class="text-sand-950 font-semibold truncate">
          {{ page.name }}
        </p>

        <!-- Right: Status + Action -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="flex items-center gap-1.5">
            <span
              class="w-2 h-2 rounded-full"
              :class="getStatus(page.status)?.dotClass"
            />
            <span class="text-xs text-sand-500 font-medium">
              {{ getStatus(page.status)?.label }}
            </span>
          </div>
          <UButton
            icon="i-lucide-pencil"
            variant="ghost"
            color="neutral"
            class="rounded-xl"
            @click="navigateTo(`/admin/website/${page.id}`)"
          />
        </div>
      </div>

      <!-- Loading skeleton -->
      <template v-if="status === 'pending'">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white rounded-2xl border border-sand-200 shadow-sm px-5 py-4 flex items-center justify-between animate-pulse"
        >
          <div class="h-5 w-32 rounded bg-sand-200" />
          <div class="flex items-center gap-3">
            <div class="h-4 w-16 rounded bg-sand-200" />
            <div class="h-8 w-8 rounded-xl bg-sand-200" />
          </div>
        </div>
      </template>

      <!-- Empty -->
      <div
        v-else-if="filteredPages.length === 0"
        class="flex flex-col items-center justify-center py-16 text-sand-400"
      >
        <UIcon
          name="i-lucide-file-x"
          class="text-4xl mb-3"
        />
        <p class="text-sm">
          沒有任何內容
        </p>
      </div>
    </div>
  </div>
</template>
