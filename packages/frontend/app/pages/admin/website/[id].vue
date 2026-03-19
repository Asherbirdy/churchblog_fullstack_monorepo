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
      onlineHtml: '',
      previousHtml: '',
      status: 'offline' as RecordStatus,
      setStatus: 'none',
      isEdit: false
    }
  },
  feature: {
    revertModal: false
  }
})

const { data, refresh: refreshPageInfo } = await usePageApi.getOne(id)

const {
  execute: executeUpdate,
  status: updateStatus
} = await usePageApi.editedHtml(
  id,
  { editedHtml: toRef(() => state.value.data.page.editedHtml) }
)

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

const {
  execute: executeGoToPreviousHtml,
  status: goToPreviousHtmlStatus,
  error: goToPreviousHtmlError
} = await usePageApi.goToPreviousHtml(id)

const refreshData = async () => {
  clearNuxtData(UserRequestUrl.Page)
  await refreshNuxtData([UserRequestUrl.Page])
  await refreshPageInfo()
}

const handleSave = async () => {
  await executeUpdate()
  await refreshData()
  toast.add({
    title: '儲存成功',
    color: 'success'
  })
}

const handleSetToOnlineScheduled = async () => {
  await executeSetToOnlineScheduled()
  await refreshData()
}

const handleSetToOfflineScheduled = async () => {
  await executeSetToOfflineScheduled()
  await refreshData()
}

const cancelScheduled = async () => {
  await executeCancelScheduled()
  await refreshData()
}

const handleGoToPreviousHtml = async () => {
  await executeGoToPreviousHtml()
  await refreshData()
  state.value.feature.revertModal = false
  if (goToPreviousHtmlError.value) {
    toast.add({
      title: '還原失敗',
      description: goToPreviousHtmlError.value as string,
      color: 'error'
    })
  }
}

const hasUnsavedChanges = computed(() => {
  const original = data.value?.page?.editedHtml || ''
  return state.value.data.page.editedHtml !== original
})

watch(data, (val) => {
  const { data: pageData } = state.value
  if (val?.page) {
    pageData.page.name = val.page.name
    pageData.page.routeName = val.page.routeName
    pageData.page.editedHtml = val.page.editedHtml || ''
    pageData.page.onlineHtml = val.page.onlineHtml || ''
    pageData.page.previousHtml = val.page.previousHtml || ''
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

          <!-- 排程中：左右對比 -->
          <div
            v-if="state.data.page.setStatus === 'scheduledOnline' || state.data.page.setStatus === 'scheduledOffline'"
            class="grid grid-cols-2 gap-4"
          >
            <!-- 左：預計上線內容 -->
            <div>
              <p class="text-xs font-medium text-sand-500 mb-1.5">
                預計上線內容
              </p>
              <div class="w-full rounded-xl border border-sand-200 bg-white p-4 min-h-[240px]">
                <div
                  class="tiptap prose prose-sm max-w-none text-left"
                  v-html="state.data.page.onlineHtml"
                />
              </div>
            </div>

            <!-- 右：目前上線版本 -->
            <div>
              <p class="text-xs font-medium text-sand-500 mb-1.5">
                目前上線版本
              </p>
              <div class="w-full rounded-xl border border-sand-200 bg-white p-4 min-h-[240px]">
                <template v-if="state.data.page.previousHtml">
                  <div
                    class="tiptap prose prose-sm max-w-none text-left"
                    v-html="state.data.page.previousHtml"
                  />
                </template>
                <p
                  v-else
                  class="text-sand-400 text-sm"
                >
                  無
                </p>
              </div>
            </div>
          </div>

          <!-- 一般狀態：編輯器 -->
          <ClientOnly v-else>
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
          v-if="state.data.page.setStatus === 'none' && !hasUnsavedChanges"
          label="安排上線"
          class="rounded-xl bg-sand-950 text-white hover:bg-sand-800"
          icon="i-lucide-calendar-check"
          :loading="setToOnlineScheduledStatus === 'pending'"
          @click="handleSetToOnlineScheduled"
        />

        <UButton
          v-if="state.data.page.setStatus === 'none' && state.data.page.status === 'online' && !hasUnsavedChanges"
          label="安排下線"
          class="rounded-xl bg-sand-950 text-white hover:bg-sand-800"
          icon="i-lucide-calendar-check"
          :loading="setToOfflineScheduledStatus === 'pending'"
          @click="handleSetToOfflineScheduled"
        />

        <UButton
          v-if="state.data.page.setStatus === 'scheduledOnline'|| state.data.page.setStatus === 'scheduledOffline'"
          label="取消排程"
          class="rounded-xl bg-sand-950 text-white hover:bg-sand-800"
          icon="i-lucide-calendar-check"
          :loading="cancelScheduledStatus === 'pending'"
          @click="cancelScheduled"
        />

        <UButton
          v-if="state.data.page.previousHtml !== ''"
          label="取消編輯"
          class="rounded-xl bg-sand-950 text-white hover:bg-sand-800"
          icon="i-lucide-undo"
          @click="state.feature.revertModal = true"
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
    <!-- Revert Modal -->
    <UModal v-model:open="state.feature.revertModal">
      <template #content>
        <div class="p-6 space-y-4">
          <h3 class="text-lg font-semibold text-sand-950">
            確認取消編輯
          </h3>
          <p class="text-sm text-sand-500">
            將還原為以下的上線版本內容：
          </p>
          <div class="w-full rounded-xl border border-sand-200 bg-sand-50 p-4 max-h-[400px] overflow-y-auto">
            <template v-if="state.data.page.previousHtml">
              <div
                class="tiptap prose prose-sm max-w-none text-left"
                v-html="state.data.page.previousHtml"
              />
            </template>
            <p
              v-else
              class="text-sand-400 text-sm"
            >
              無
            </p>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              label="取消"
              variant="outline"
              class="rounded-xl"
              @click="state.feature.revertModal = false"
            />
            <UButton
              label="確認還原"
              class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
              icon="i-lucide-undo"
              :loading="goToPreviousHtmlStatus === 'pending'"
              @click="handleGoToPreviousHtml"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
