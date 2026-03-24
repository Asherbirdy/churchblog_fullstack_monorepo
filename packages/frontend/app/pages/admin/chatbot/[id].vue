<script setup lang="ts">
import { useChatTopicApi, useChatCardApi } from '~/api'
import type { ChatCard } from '~/api'
import { UserRequestUrl } from '~/enum'

const route = useRoute()
const topicId = route.params.id as string
const topicKey = `${UserRequestUrl.ChatTopic}-${topicId}`

const state = ref({
  data: {},
  feature: {
    create: {
      modal: false,
      name: '',
      url: '',
      description: '',
      loading: false
    },
    editModal: false,
    editId: '',
    editName: '',
    editUrl: '',
    editDescription: '',
    editLoading: false,
    deleteModal: false,
    deleteTargetId: ''
  }
})

const { data: topicData } = await useChatTopicApi.getOne(topicId)

// -- Hoisted API calls --

const {
  execute: executeCreate
} = await useChatCardApi.create(
  toRef(() => ({
    name: state.value.feature.create.name.trim(),
    url: state.value.feature.create.url.trim(),
    description: state.value.feature.create.description.trim(),
    chatTopicId: topicId
  })))

const editId = computed(() => state.value.feature.editId)

const {
  execute: executeEdit
} = await useChatCardApi.update(editId, toRef(() => ({
  name: state.value.feature.editName.trim(),
  url: state.value.feature.editUrl.trim(),
  description: state.value.feature.editDescription.trim()
})))

const deleteId = computed(() => state.value.feature.deleteTargetId)
const { execute: executeDelete } = await useChatCardApi.delete(deleteId)

const toggleId = ref('')
const toggleBody = ref<{ online?: boolean }>({})
const { execute: executeToggle } = await useChatCardApi.update(computed(() => toggleId.value), toRef(() => toggleBody.value))

// -- Helpers --
const refreshTopic = async () => {
  clearNuxtData(topicKey)
  await refreshNuxtData([topicKey])
}

const openCreateModal = () => {
  const { feature } = state.value
  feature.create.name = ''
  feature.create.url = ''
  feature.create.description = ''
  feature.create.modal = true
}

const confirmCreate = async () => {
  const { feature } = state.value
  if (!feature.create.name.trim() || !feature.create.url.trim()) return

  feature.create.loading = true
  await executeCreate()
  await refreshTopic()
  feature.create.loading = false
  feature.create.modal = false
}

const openEditModal = (card: ChatCard) => {
  const { feature } = state.value
  feature.editId = card.id
  feature.editName = card.name
  feature.editUrl = card.url
  feature.editDescription = card.description
  feature.editModal = true
}

const confirmEdit = async () => {
  const { feature } = state.value
  if (!feature.editName.trim() || !feature.editUrl.trim()) return

  feature.editLoading = true
  await executeEdit()
  await refreshTopic()
  feature.editLoading = false
  feature.editModal = false
}

const openDeleteModal = (id: string) => {
  const { feature } = state.value
  feature.deleteTargetId = id
  feature.deleteModal = true
}

const confirmDelete = async () => {
  const { feature } = state.value
  await executeDelete()
  await refreshTopic()
  feature.deleteModal = false
  feature.deleteTargetId = ''
}

const toggleOnline = async (card: ChatCard) => {
  toggleId.value = card.id
  toggleBody.value = { online: !card.online }
  await executeToggle()
  await refreshTopic()
}
</script>

<template>
  <div class="w-full animate-fade-up">
    <!-- Back + Title -->
    <div class="flex items-center gap-3 mb-8">
      <UButton
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-left"
        to="/admin/chatbot"
      />
      <div class="flex-1">
        <h2 class="font-display text-2xl font-bold text-sand-950 mb-1">
          {{ topicData?.chatTopic?.name ?? '載入中...' }}
        </h2>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="keyword in topicData?.chatTopic?.keywords"
            :key="keyword"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sage-100 text-sage-700"
          >
            {{ keyword }}
          </span>
        </div>
      </div>
      <UButton
        icon="i-lucide-plus"
        @click="openCreateModal"
      >
        新增卡片
      </UButton>
    </div>

    <!-- Empty State -->
    <div
      v-if="!topicData?.chatTopic?.cards?.length"
      class="bg-white rounded-2xl border border-sand-200 shadow-sm p-12 text-center"
    >
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sand-100">
        <UIcon
          name="i-lucide-credit-card"
          class="text-sand-400 text-xl"
        />
      </div>
      <p class="text-sand-500 text-sm">
        尚未建立任何卡片
      </p>
    </div>

    <!-- Card List -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="card in topicData?.chatTopic?.cards"
        :key="card.id"
        class="bg-white rounded-2xl border border-sand-200 shadow-sm p-5 flex flex-col"
      >
        <div class="flex items-start justify-between mb-3">
          <p class="font-medium text-sand-950">
            {{ card.name }}
          </p>
          <button
            class="shrink-0 ml-2"
            @click="toggleOnline(card)"
          >
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
              :class="card.online ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-sand-100 text-sand-500 hover:bg-sand-200'"
            >
              {{ card.online ? '上線' : '下線' }}
            </span>
          </button>
        </div>

        <a
          :href="card.url"
          target="_blank"
          class="text-xs text-sage-600 hover:underline break-all mb-2"
        >
          {{ card.url }}
        </a>

        <p
          v-if="card.description"
          class="text-sm text-sand-500 mb-4 flex-1"
        >
          {{ card.description }}
        </p>
        <div
          v-else
          class="flex-1"
        />

        <div class="flex gap-2 pt-3 border-t border-sand-100">
          <UButton
            variant="soft"
            size="xs"
            icon="i-lucide-pencil"
            @click="openEditModal(card)"
          >
            編輯
          </UButton>
          <UButton
            color="error"
            variant="soft"
            size="xs"
            icon="i-lucide-trash-2"
            @click="openDeleteModal(card.id)"
          >
            刪除
          </UButton>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <UModal v-model:open="state.feature.create.modal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-sand-950 mb-1">
            新增卡片
          </h3>
          <p class="text-sm text-sand-500 mb-5">
            建立新的聊天卡片
          </p>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">名稱</label>
              <UInput
                v-model="state.feature.create.name"
                placeholder="輸入卡片名稱"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">網址</label>
              <UInput
                v-model="state.feature.create.url"
                placeholder="https://..."
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">描述</label>
              <UInput
                v-model="state.feature.create.description"
                placeholder="輸入卡片描述（選填）"
                class="w-full"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <UButton
              variant="outline"
              color="neutral"
              @click="state.feature.create.modal = false"
            >
              取消
            </UButton>
            <UButton
              :loading="state.feature.create.loading"
              :disabled="!state.feature.create.name.trim() || !state.feature.create.url.trim()"
              @click="confirmCreate"
            >
              建立
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Edit Modal -->
    <UModal v-model:open="state.feature.editModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-sand-950 mb-1">
            編輯卡片
          </h3>
          <p class="text-sm text-sand-500 mb-5">
            修改卡片資訊
          </p>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">名稱</label>
              <UInput
                v-model="state.feature.editName"
                placeholder="輸入卡片名稱"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">網址</label>
              <UInput
                v-model="state.feature.editUrl"
                placeholder="https://..."
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">描述</label>
              <UInput
                v-model="state.feature.editDescription"
                placeholder="輸入卡片描述（選填）"
                class="w-full"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <UButton
              variant="outline"
              color="neutral"
              @click="state.feature.editModal = false"
            >
              取消
            </UButton>
            <UButton
              :loading="state.feature.editLoading"
              :disabled="!state.feature.editName.trim() || !state.feature.editUrl.trim()"
              @click="confirmEdit"
            >
              儲存
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirm Modal -->
    <UModal v-model:open="state.feature.deleteModal">
      <template #content>
        <div class="p-6 text-center">
          <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <UIcon
              name="i-lucide-triangle-alert"
              class="text-red-600 text-xl"
            />
          </div>
          <h3 class="text-lg font-semibold text-sand-950 mb-2">
            確認刪除
          </h3>
          <p class="text-sm text-sand-500 mb-6">
            確定要刪除此卡片嗎？此操作無法復原。
          </p>
          <div class="flex justify-center gap-3">
            <UButton
              variant="outline"
              color="neutral"
              @click="state.feature.deleteModal = false"
            >
              取消
            </UButton>
            <UButton
              color="error"
              @click="confirmDelete"
            >
              確認刪除
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
