<script setup lang="ts">
const state = ref({
  data: {
    pages: [
      { id: '1', name: '復活節活動報名', status: 'online' },
      { id: '2', name: '主日學介紹', status: 'offline' },
      { id: '3', name: '小組聚會時間表', status: 'online' },
      { id: '4', name: '聖誕節特別聚會', status: 'offline' }
    ]
  },
  feature: {
    activeTab: 'all',
    showCreateModal: false
  }
})

const createForm = ref({
  name: '',
  routeName: ''
})

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'online', label: '上線中' },
  { key: 'offline', label: '未上線' }
]

const statusMap: Record<string, { label: string, dotClass: string }> = {
  online: { label: '上線中', dotClass: 'bg-emerald-500' },
  offline: { label: '未上線', dotClass: 'bg-sand-300' }
}

const getStatus = (status: string) => statusMap[status] || statusMap.offline

const filteredPages = computed(() => {
  if (state.value.feature.activeTab === 'all') return state.value.data.pages
  return state.value.data.pages.filter(p => p.status === state.value.feature.activeTab)
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
      <UButton
        label="新增網站"
        icon="i-lucide-plus"
        class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
        @click="state.feature.showCreateModal = true"
      />
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
          />
        </div>
      </div>
    </div>

    <!-- Empty filtered -->
    <div
      v-if="filteredPages.length === 0"
      class="bg-white rounded-2xl border border-sand-200 shadow-sm p-12 text-center"
    >
      <p class="text-sm text-sand-400">
        沒有符合的網站
      </p>
    </div>

    <!-- Create Modal -->
    <UModal v-model:open="state.feature.showCreateModal">
      <template #content>
        <div class="p-6">
          <h3 class="font-display text-lg font-bold text-sand-950 mb-6">
            新增一頁網站
          </h3>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-medium text-sand-400 uppercase tracking-wide mb-1.5 block">
                網站名稱
              </label>
              <UInput
                v-model="createForm.name"
                placeholder="例：活動報名頁"
                icon="i-lucide-type"
                size="lg"
                :ui="{ base: 'rounded-xl' }"
              />
            </div>
            <div>
              <label class="text-xs font-medium text-sand-400 uppercase tracking-wide mb-1.5 block">
                路由名稱
              </label>
              <UInput
                v-model="createForm.routeName"
                placeholder="例：event-signup"
                icon="i-lucide-link"
                size="lg"
                :ui="{ base: 'rounded-xl' }"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <UButton
              label="取消"
              color="neutral"
              variant="outline"
              class="rounded-xl"
              @click="state.feature.showCreateModal = false"
            />
            <UButton
              label="建立"
              class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
