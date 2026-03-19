<script setup lang="ts">
import { usePageApi } from '~/api'
import { UserRequestUrl, type RecordStatus } from '~/enum'
import { TiptapEditor } from '@/components'

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

const { data, refresh: refreshPageInfo } = await usePageApi.getOne(id)

const {
  execute: executeUpdate,
  status: updateStatus
} = await usePageApi.editedHtml(id, {
  editedHtml: toRef(() => state.value.data.page.editedHtml)
})

const {
  execute: executeSetToOnlineScheduled,
  status: setToOnlineScheduledStatus
} = await usePageApi.setToOnlineScheduled(id)

const {
  execute: executeSetToOfflineScheduled,
  status: setToOfflineScheduledStatus
} = await usePageApi.setToOfflineScheduled(id)

const {
  execute: executeCancelScheduled,
  status: cancelScheduledStatus
} = await usePageApi.cancelScheduled(id)

const handleSave = async () => {
  await executeUpdate()
  clearNuxtData(UserRequestUrl.Page)
  await refreshNuxtData([UserRequestUrl.Page])
  await refreshPageInfo()
  toast.add({
    title: '儲存成功',
    color: 'success'
  })
}

const handleSetToOnlineScheduled = async () => {
  await executeSetToOnlineScheduled()
  clearNuxtData(UserRequestUrl.Page)
  await refreshNuxtData([UserRequestUrl.Page])
  await refreshPageInfo()
}

const handleSetToOfflineScheduled = async () => {
  await executeSetToOfflineScheduled()
  clearNuxtData(UserRequestUrl.Page)
  await refreshNuxtData([UserRequestUrl.Page])
  await refreshPageInfo()
}

const cancelScheduled = async () => {
  await executeCancelScheduled()
  clearNuxtData(UserRequestUrl.Page)
  await refreshNuxtData([UserRequestUrl.Page])
  await refreshPageInfo()
}

watch(data, (val) => {
  const { data: pageData } = state.value
  if (val?.page) {
    pageData.page.name = val.page.name
    pageData.page.routeName = val.page.routeName
    pageData.page.editedHtml = val.page.editedHtml || ''
    pageData.page.status = val.page.status as RecordStatus
    pageData.page.setStatus = val.page.setStatus || 'none'
    pageData.page.isEdit = val.page.isEdit
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
            :label="state.data.page.isEdit ? '已編輯' : '未編輯'"
          />
          <UBadge
            :color="state.data.page.isEdit ? 'warning' : 'neutral'"
            variant="subtle"
            :label="state.data.page.isEdit ? '已編輯' : '未編輯'"
          >
            {{ state.data.page.setStatus }}
          </UBadge>
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
          v-if="state.data.page.isEdit"
          label="安排上線"
          class="rounded-xl bg-sand-950 text-white hover:bg-sand-800"
          icon="i-lucide-calendar-check"
          :loading="setToOnlineScheduledStatus === 'pending'"
          @click="handleSetToOnlineScheduled"
        />

        <UButton
          v-if="state.data.page.isEdit"
          label="安排下線"
          class="rounded-xl bg-sand-950 text-white hover:bg-sand-800"
          icon="i-lucide-calendar-check"
          :loading="setToOfflineScheduledStatus === 'pending'"
          @click="handleSetToOfflineScheduled"
        />

        <UButton
          v-if="state.data.page.isEdit"
          label="取消排程"
          class="rounded-xl bg-sand-950 text-white hover:bg-sand-800"
          icon="i-lucide-calendar-check"
          :loading="cancelScheduledStatus === 'pending'"
          @click="cancelScheduled"
        />

        <UButton
          label="儲存"
          class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
          icon="i-lucide-save"
          :loading="updateStatus === 'pending'"
          :disabled="
            !data
              || state.data.page.setStatus === 'scheduledOnline'
              || state.data.page.setStatus === 'scheduledOffline'
          "
          @click="handleSave"
        />
      </div>
    </div>
  </div>
</template>
