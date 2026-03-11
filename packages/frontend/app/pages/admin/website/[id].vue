<script setup lang="ts">
import { usePageApi } from '~/api'

definePageMeta({
  layout: 'editor'
})

const route = useRoute()
const id = route.params.id as string

const { data } = await usePageApi.getOne(id)

const state = ref({
  data: {
    page: {
      id,
      name: data.value?.page.name ?? '',
      routeName: data.value?.page.routeName ?? '',
      contentHtml: data.value?.page.contentHtml ?? '',
      status: data.value?.page.status ?? 'offline',
      isEdit: data.value?.page.isEdit ?? false
    }
  },
  feature: {}
})

const statusOptions = [
  { label: '上線中', value: 'online' },
  { label: '未上線', value: 'offline' }
]

const statusDot = computed(() =>
  state.value.data.page.status === 'online' ? 'bg-emerald-500' : 'bg-sand-300'
)
</script>

<template>
  <div class="max-w-2xl mx-auto animate-fade-up">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-1">
        <h2 class="font-display text-2xl font-bold text-sand-950">
          編輯網站
        </h2>
        <span class="flex items-center gap-1.5 text-xs text-sand-400 bg-sand-100 px-2.5 py-1 rounded-full font-mono">
          <UIcon
            name="i-lucide-link"
            class="text-xs"
          />
          /{{ state.data.page.routeName }}
        </span>
      </div>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-2xl border border-sand-200 shadow-sm">
      <div class="p-6 space-y-6">
        <!-- Name -->
        <div>
          <label class="text-xs font-medium text-sand-500 mb-1.5 block">
            網站名稱
          </label>
          <UInput
            v-model="state.data.page.name"
            icon="i-lucide-type"
            size="lg"
            class="w-full"
            :ui="{ base: 'rounded-xl' }"
          />
        </div>

        <!-- Status -->
        <div>
          <label class="text-xs font-medium text-sand-500 mb-1.5 block">
            狀態
          </label>
          <div class="flex items-center gap-3 w-full">
            <USelect
              v-model="state.data.page.status"
              :items="statusOptions"
              size="lg"
              class="w-full"
              :ui="{ base: 'rounded-xl' }"
            />
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0"
              :class="statusDot"
            />
          </div>
        </div>

        <!-- Content -->
        <div>
          <label class="text-xs font-medium text-sand-500 mb-1.5 block w-full">
            內容
          </label>
          <ClientOnly>
            <TiptapEditor v-model="state.data.page.contentHtml" />
            <template #fallback>
              <div class="w-full rounded-xl border border-sand-200 bg-white min-h-[290px] animate-pulse" />
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 px-6 py-4 border-t border-sand-100">
        <UButton
          label="儲存"
          class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
          icon="i-lucide-save"
        />
      </div>
    </div>
  </div>
</template>
