<script setup lang="ts">
import { useAccountApi } from '~/api'

const state = ref({
  data: {},
  feature: {
    deleteModal: false,
    deleteTargetId: ''
  }
})

const { data, execute } = await useAccountApi.getAllUser()
const users = computed(() => data.value?.users ?? [])

const roleLabel = (role: string) => role === 'admin' ? '管理員' : '一般用戶'

const openDeleteModal = (id: string) => {
  const { feature } = state.value
  feature.deleteTargetId = id
  feature.deleteModal = true
}

const confirmDelete = async () => {
  const { feature } = state.value
  await useAccountApi.deleteUser(feature.deleteTargetId)
  await execute()
  feature.deleteModal = false
  feature.deleteTargetId = ''
}
</script>

<template>
  <div class="max-w-4xl animate-fade-up">
    <!-- Page Title -->
    <div class="mb-8">
      <h2 class="font-display text-2xl font-bold text-sand-950 mb-1">
        帳號管理
      </h2>
      <p class="text-sm text-sand-500">
        管理系統使用者帳號
      </p>
    </div>

    <!-- User Table Card -->
    <div class="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-sand-200 bg-sand-50">
            <th class="text-left px-6 py-3 text-xs font-medium text-sand-400 uppercase tracking-wide">
              姓名
            </th>
            <th class="text-left px-6 py-3 text-xs font-medium text-sand-400 uppercase tracking-wide">
              電子信箱
            </th>
            <th class="text-left px-6 py-3 text-xs font-medium text-sand-400 uppercase tracking-wide">
              角色
            </th>
            <th class="text-left px-6 py-3 text-xs font-medium text-sand-400 uppercase tracking-wide">
              狀態
            </th>
            <th class="text-left px-6 py-3 text-xs font-medium text-sand-400 uppercase tracking-wide">
              建立日期
            </th>
            <th class="text-left px-6 py-3 text-xs font-medium text-sand-400 uppercase tracking-wide">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-sand-100 last:border-b-0 hover:bg-sand-50 transition-colors"
          >
            <td class="px-6 py-4 font-medium text-sand-950">
              {{ user.name }}
            </td>
            <td class="px-6 py-4 text-sand-600">
              {{ user.email }}
            </td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="user.role === 'admin' ? 'bg-sage-100 text-sage-700' : 'bg-sand-100 text-sand-600'"
              >
                {{ roleLabel(user.role) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
              >
                {{ user.isBlocked ? '已封鎖' : '正常' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sand-500">
              {{ user.createdAt }}
            </td>
            <td class="px-6 py-4">
              <UButton
                color="error"
                variant="soft"
                size="xs"
                icon="i-lucide-trash-2"
                @click="openDeleteModal(user.id)"
              >
                刪除
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
            確定要刪除此帳號嗎？此操作無法復原。
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
