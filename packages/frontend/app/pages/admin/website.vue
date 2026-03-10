<script setup lang="ts">
const state = ref({
  data: {
    pages: [
      {
        id: '1',
        name: '復活節活動報名',
        routeName: 'easter-signup',
        status: 'online',
        isEdit: false,
        lastEditedAt: '2026-03-08T10:30:00Z',
        updatedAt: '2026-03-08T10:30:00Z'
      },
      {
        id: '2',
        name: '主日學介紹',
        routeName: 'sunday-school',
        status: 'offline',
        isEdit: true,
        lastEditedAt: '2026-03-05T14:20:00Z',
        updatedAt: '2026-03-05T14:20:00Z'
      },
      {
        id: '3',
        name: '小組聚會時間表',
        routeName: 'group-schedule',
        status: 'online',
        isEdit: false,
        lastEditedAt: '2026-02-28T09:00:00Z',
        updatedAt: '2026-02-28T09:00:00Z'
      }
    ]
  },
  feature: {
    showCreateModal: false
  }
})

const createForm = ref({
  name: '',
  routeName: ''
})

const statusMap: Record<string, { label: string, color: string, icon: string }> = {
  online: { label: '上線中', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: 'i-lucide-globe' },
  offline: { label: '未上線', color: 'text-sand-400 bg-sand-50 border-sand-200', icon: 'i-lucide-globe-lock' }
}

const getStatus = (status: string) => statusMap[status] || statusMap.offline

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
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

    <!-- Page List -->
    <div class="space-y-4">
      <div
        v-for="page in state.data.pages"
        :key="page.id"
        class="bg-white rounded-2xl border border-sand-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="p-5 flex items-center justify-between">
          <div class="flex items-center gap-4 min-w-0">
            <!-- Icon -->
            <div class="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center shrink-0">
              <UIcon
                :name="getStatus(page.status)?.icon"
                class="text-sage-600 text-lg"
              />
            </div>

            <!-- Info -->
            <div class="min-w-0">
              <p class="text-sand-950 font-semibold truncate">
                {{ page.name }}
              </p>
              <div class="flex items-center gap-3 mt-1">
                <span class="text-xs text-sand-400 font-mono">
                  /{{ page.routeName }}
                </span>
                <span class="text-sand-200">·</span>
                <span class="text-xs text-sand-400">
                  {{ formatDate(page.updatedAt) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Status + Actions -->
          <div class="flex items-center gap-3 shrink-0">
            <!-- Status Badge -->
            <span
              class="text-xs px-2.5 py-1 rounded-full border font-medium"
              :class="getStatus(page.status).color"
            >
              {{ getStatus(page.status).label }}
            </span>

            <!-- Edit Indicator -->
            <div
              v-if="page.isEdit"
              class="text-xs text-warm-600 bg-warm-50 border border-warm-200 px-2.5 py-1 rounded-full font-medium"
            >
              編輯中
            </div>

            <!-- Action Button -->
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              class="rounded-xl"
            />
          </div>
        </div>
      </div>
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
