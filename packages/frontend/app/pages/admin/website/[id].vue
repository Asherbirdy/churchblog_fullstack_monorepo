<script setup lang="ts">
import { usePageApi } from '~/api'
import { UserRequestUrl, type RecordStatus } from '~/enum'

definePageMeta({
  layout: 'editor'
})

const route = useRoute()
const toast = useToast()
const id = route.params.id as string

const state = ref({
  data: {
    page: {
      id,
      name: '',
      routeName: '',
      contentHtml: '',
      status: 'offline' as RecordStatus,
      isEdit: false
    }
  }
})

const { data } = await usePageApi.getOne(id)

const {
  execute: executeUpdate,
  status: updateStatus
} = await usePageApi.update({
  id,
  body: state.value.data.page
})

const handleSave = async () => {
  await executeUpdate()
  clearNuxtData(UserRequestUrl.Page)
  await refreshNuxtData([UserRequestUrl.Page])
  toast.add({
    title: '儲存成功',
    color: 'success'
  })
}

watch(data, (val) => {
  if (val?.page) {
    state.value.data.page.name = val.page.name
    state.value.data.page.routeName = val.page.routeName
    state.value.data.page.contentHtml = val.page.contentHtml || ''
    state.value.data.page.status = val.page.status as RecordStatus
    state.value.data.page.isEdit = val.page.isEdit
  }
}, { immediate: true })
</script>

<template>
  <div class="max-w-4xl mx-auto animate-fade-up">
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
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-file-text"
            class="text-sage-600 text-lg"
          />
          <h3 class="text-lg font-semibold text-sand-950">
            {{ state.data.page.name }}
          </h3>
          <span
            class="ml-auto flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
            :class="state.data.page.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-sand-100 text-sand-400'"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="state.data.page.status === 'online' ? 'bg-emerald-500' : 'bg-sand-300'"
            />
            {{ state.data.page.status === 'online' ? '上線中' : '未上線' }}
          </span>
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
          :loading="updateStatus === 'pending'"
          :disabled="!data"
          @click="handleSave"
        />
      </div>
    </div>
  </div>
</template>
