<script setup lang="ts">
import { useChatTopicApi } from '~/api'
import type { ChatTopic } from '~/api'
import { UserRequestUrl } from '~/enum'

const state = ref({
  data: {},
  feature: {
    createModal: false,
    createName: '',
    createKeywords: '',
    createLoading: false,
    createError: '',
    editModal: false,
    editId: '',
    editName: '',
    editKeywords: '',
    editLoading: false,
    deleteModal: false,
    deleteTargetId: '',
    expandedId: ''
  }
})

const { data, execute } = await useChatTopicApi.getAll()
const chatTopics = computed(() => data.value?.chatTopics ?? [])

const openCreateModal = () => {
  const { feature } = state.value
  feature.createName = ''
  feature.createKeywords = ''
  feature.createError = ''
  feature.createModal = true
}

const confirmCreate = async () => {
  const { feature } = state.value
  if (!feature.createName.trim()) return

  feature.createLoading = true
  feature.createError = ''

  const keywords = feature.createKeywords
    .split(',')
    .map(k => k.trim())
    .filter(Boolean)

  const { execute: exec, error } = await useChatTopicApi.create({
    name: feature.createName.trim(),
    keywords
  })
  await exec()

  if (error.value?.data?.error === 'CHAT_TOPIC_NAME_ALREADY_EXISTS') {
    feature.createError = '主題名稱已存在'
    feature.createLoading = false
    return
  }

  clearNuxtData(UserRequestUrl.ChatTopic)
  await execute()
  feature.createLoading = false
  feature.createModal = false
}

const openEditModal = (topic: ChatTopic) => {
  const { feature } = state.value
  feature.editId = topic.id
  feature.editName = topic.name
  feature.editKeywords = topic.keywords.join(', ')
  feature.editModal = true
}

const confirmEdit = async () => {
  const { feature } = state.value
  if (!feature.editName.trim()) return

  feature.editLoading = true

  const keywords = feature.editKeywords
    .split(',')
    .map(k => k.trim())
    .filter(Boolean)

  const { execute: exec } = await useChatTopicApi.update(feature.editId, {
    name: feature.editName.trim(),
    keywords
  })
  await exec()

  clearNuxtData(UserRequestUrl.ChatTopic)
  await execute()
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
  const { execute: exec } = await useChatTopicApi.delete(feature.deleteTargetId)
  await exec()

  clearNuxtData(UserRequestUrl.ChatTopic)
  await execute()
  feature.deleteModal = false
  feature.deleteTargetId = ''
}

const toggleExpand = (id: string) => {
  const { feature } = state.value
  feature.expandedId = feature.expandedId === id ? '' : id
}
</script>

<template>
  <div class="w-full animate-fade-up">
    <!-- Page Title -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="font-display text-2xl font-bold text-sand-950 mb-1">
          聊天機器人
        </h2>
        <p class="text-sm text-sand-500">
          管理聊天主題與關鍵字
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        @click="openCreateModal"
      >
        新增主題
      </UButton>
    </div>

    <!-- Empty State -->
    <div
      v-if="!chatTopics.length"
      class="bg-white rounded-2xl border border-sand-200 shadow-sm p-12 text-center"
    >
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sand-100">
        <UIcon
          name="i-lucide-message-circle"
          class="text-sand-400 text-xl"
        />
      </div>
      <p class="text-sand-500 text-sm">
        尚未建立任何聊天主題
      </p>
    </div>

    <!-- Topic List -->
    <div class="space-y-3">
      <div
        v-for="topic in chatTopics"
        :key="topic.id"
        class="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden"
      >
        <!-- Topic Header -->
        <div
          class="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-sand-50 transition-colors"
          @click="toggleExpand(topic.id)"
        >
          <div class="flex items-center gap-3">
            <UIcon
              name="i-lucide-chevron-right"
              class="text-sand-400 transition-transform"
              :class="{ 'rotate-90': state.feature.expandedId === topic.id }"
            />
            <div>
              <p class="font-medium text-sand-950">
                {{ topic.name }}
              </p>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="keyword in topic.keywords"
                  :key="keyword"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sage-100 text-sage-700"
                >
                  {{ keyword }}
                </span>
                <span
                  v-if="!topic.keywords.length"
                  class="text-sand-400 text-xs"
                >
                  無關鍵字
                </span>
              </div>
            </div>
          </div>
          <div
            class="flex gap-2"
            @click.stop
          >
            <UButton
              variant="soft"
              size="xs"
              icon="i-lucide-pencil"
              @click="openEditModal(topic)"
            >
              編輯
            </UButton>
            <UButton
              color="error"
              variant="soft"
              size="xs"
              icon="i-lucide-trash-2"
              @click="openDeleteModal(topic.id)"
            >
              刪除
            </UButton>
          </div>
        </div>

        <!-- Expanded: Cards -->
        <div
          v-if="state.feature.expandedId === topic.id"
          class="border-t border-sand-200 px-6 py-4 bg-sand-50"
        >
          <p class="text-xs font-medium text-sand-400 uppercase tracking-wide mb-3">
            關聯卡片 ({{ topic.cards.length }})
          </p>
          <div
            v-if="topic.cards.length"
            class="space-y-2"
          >
            <div
              v-for="card in topic.cards"
              :key="card.id"
              class="flex items-center justify-between bg-white rounded-xl border border-sand-200 px-4 py-3"
            >
              <div>
                <p class="text-sm font-medium text-sand-950">
                  {{ card.name }}
                </p>
                <p class="text-xs text-sand-400 mt-0.5">
                  {{ card.url }}
                </p>
              </div>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="card.online ? 'bg-green-100 text-green-700' : 'bg-sand-100 text-sand-500'"
              >
                {{ card.online ? '上線' : '下線' }}
              </span>
            </div>
          </div>
          <p
            v-else
            class="text-sm text-sand-400"
          >
            尚無關聯卡片
          </p>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <UModal v-model:open="state.feature.createModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-sand-950 mb-1">
            新增聊天主題
          </h3>
          <p class="text-sm text-sand-500 mb-5">
            建立新的聊天主題與關鍵字
          </p>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">主題名稱</label>
              <UInput
                v-model="state.feature.createName"
                placeholder="輸入主題名稱"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">關鍵字</label>
              <UInput
                v-model="state.feature.createKeywords"
                placeholder="以逗號分隔，例如：聚會, 禮拜, 時間"
                class="w-full"
              />
              <p class="text-xs text-sand-400 mt-1">
                多個關鍵字請以逗號分隔
              </p>
            </div>
            <p
              v-if="state.feature.createError"
              class="text-sm text-red-500"
            >
              {{ state.feature.createError }}
            </p>
          </div>
          <div class="flex justify-end gap-3">
            <UButton
              variant="outline"
              color="neutral"
              @click="state.feature.createModal = false"
            >
              取消
            </UButton>
            <UButton
              :loading="state.feature.createLoading"
              :disabled="!state.feature.createName.trim()"
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
            編輯聊天主題
          </h3>
          <p class="text-sm text-sand-500 mb-5">
            修改主題名稱與關鍵字
          </p>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">主題名稱</label>
              <UInput
                v-model="state.feature.editName"
                placeholder="輸入主題名稱"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">關鍵字</label>
              <UInput
                v-model="state.feature.editKeywords"
                placeholder="以逗號分隔，例如：聚會, 禮拜, 時間"
                class="w-full"
              />
              <p class="text-xs text-sand-400 mt-1">
                多個關鍵字請以逗號分隔
              </p>
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
              :disabled="!state.feature.editName.trim()"
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
            確定要刪除此主題嗎？底下所有卡片也會一併刪除，此操作無法復原。
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
