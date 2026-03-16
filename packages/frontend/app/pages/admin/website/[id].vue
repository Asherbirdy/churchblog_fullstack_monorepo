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
      editedHtml: '',
      status: 'offline' as RecordStatus,
      setStatus: 'none',
      isEdit: false
    }
  }
})

const { data } = await usePageApi.getOne(id)

const {
  execute: executeUpdate,
  status: updateStatus
} = await usePageApi.editedHtml(id, {
  editedHtml: toRef(() => state.value.data.page.editedHtml)
})

const {
  execute: executeScheduled,
  status: scheduledStatus
} = await usePageApi.scheduled(id)

const {
  execute: executeCancelScheduled,
  status: cancelScheduledStatus
} = await usePageApi.cancelScheduled(id)

const handleSave = async () => {
  await executeUpdate()
  clearNuxtData(UserRequestUrl.Page)
  await refreshNuxtData([UserRequestUrl.Page])
  toast.add({
    title: '儲存成功',
    color: 'success'
  })
}

const handleScheduled = async () => {
  if (state.value.data.page.setStatus === 'scheduledOnline') {
    await executeCancelScheduled()
  }

  if (state.value.data.page.setStatus === 'scheduledOffline') {
    await executeScheduled()
  }

  clearNuxtData(UserRequestUrl.Page)
  await refreshNuxtData([UserRequestUrl.Page])
}

watch(data, (val) => {
  if (val?.page) {
    state.value.data.page.name = val.page.name
    state.value.data.page.routeName = val.page.routeName
    state.value.data.page.editedHtml = val.page.editedHtml || ''
    state.value.data.page.status = val.page.status as RecordStatus
    state.value.data.page.setStatus = val.page.setStatus || 'none'
    state.value.data.page.isEdit = val.page.isEdit
  }
}, { immediate: true })
</script>

<template>
  <div class="max-w-6xl mx-auto animate-fade-up">
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
          <UBadge
            :color="state.data.page.status === 'online' ? 'success' : 'neutral'"
            variant="subtle"
            :label="state.data.page.status === 'online' ? '上線中' : '未上線'"
          />
          <UBadge
            :color="state.data.page.isEdit ? 'warning' : 'neutral'"
            variant="subtle"
            :label="state.data.page.isEdit ? '已編輯，請安排上線' : '未編輯'"
          />
        </div>

        <!-- Content -->
        <div>
          <label class="text-xs font-medium text-sand-500 mb-1.5 block w-full">
            內容
          </label>
          <ClientOnly>
            <TiptapEditor v-model="state.data.page.editedHtml" />
            <template #fallback>
              <div class="w-full rounded-xl border border-sand-200 bg-white min-h-[290px] animate-pulse" />
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 px-6 py-4 border-t border-sand-100">
        <UButton
          v-if="state.data.page.status === 'online'"
          label="取消上線排程"
          class="rounded-xl bg-warm-500 text-white hover:bg-warm-600"
          icon="i-lucide-calendar-x"
          :disabled="cancelScheduledStatus === 'pending'"
          :loading="cancelScheduledStatus === 'pending'"
          @click="handleScheduled"
        />
        <UButton
          v-if="state.data.page.isEdit"
          label="安排上線"
          class="rounded-xl bg-sand-950 text-white hover:bg-sand-800"
          icon="i-lucide-calendar-check"
          :loading="scheduledStatus === 'pending'"
          @click="handleScheduled"
        />
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
