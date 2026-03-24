<script setup lang="ts">
import { useAccountApi } from '~/api'
import { UserRequestUrl } from '~/enum'

const accessOptions = [
  { label: '頁面管理', value: 'page' },
  { label: '聊天機器人', value: 'chatbot' }
]

const state = ref({
  data: {},
  feature: {
    register: {
      modal: false,
      name: '',
      email: '',
      password: '',
      loading: false
    },
    delete: {
      modal: false,
      targetId: ''
    },
    access: {
      modal: false,
      targetId: '',
      targetName: '',
      selected: [] as string[],
      loading: false
    }
  }
})

const { data, execute } = await useAccountApi.getAllUser()
const users = computed(() => data.value?.users ?? [])

const editAccessBody = computed(() => ({
  userId: state.value.feature.access.targetId,
  access: state.value.feature.access.selected
}))
const { execute: executeEditAccess } = await useAccountApi.editAccess(toRef(() => editAccessBody.value))

const registerBody = computed(() => ({
  name: state.value.feature.register.name.trim(),
  email: state.value.feature.register.email.trim(),
  password: state.value.feature.register.password
}))
const { execute: executeRegister } = await useAccountApi.adminRegisterUser(registerBody.value)

const openRegisterModal = () => {
  const { register } = state.value.feature
  register.name = ''
  register.email = ''
  register.password = ''
  register.modal = true
}

const confirmRegister = async () => {
  const { register } = state.value.feature
  register.loading = true
  await executeRegister()
  clearNuxtData(UserRequestUrl.AccountGetAllUser)
  await execute()
  register.loading = false
  register.modal = false
}

const roleLabel = (role: string) => role === 'admin' ? '管理員' : '一般用戶'

const accessLabel = (value: string) => {
  return accessOptions.find(o => o.value === value)?.label ?? value
}

const openDeleteModal = (id: string) => {
  const { delete: del } = state.value.feature
  del.targetId = id
  del.modal = true
}

const confirmDelete = async () => {
  const { delete: del } = state.value.feature
  const { execute: executeDelete } = await useAccountApi.deleteUser(del.targetId)
  await executeDelete()
  await execute()
  del.modal = false
  del.targetId = ''
}

const openAccessModal = (user: { id: string, name: string, access: string[] }) => {
  const { access } = state.value.feature
  access.targetId = user.id
  access.targetName = user.name
  access.selected = [...user.access]
  access.modal = true
}

const toggleAccess = (value: string) => {
  const { access } = state.value.feature
  const idx = access.selected.indexOf(value)
  if (idx === -1) {
    access.selected.push(value)
  } else {
    access.selected.splice(idx, 1)
  }
}

const confirmEditAccess = async () => {
  const { access } = state.value.feature
  access.loading = true
  await executeEditAccess()
  clearNuxtData(UserRequestUrl.AccountGetAllUser)
  await execute()
  access.loading = false
  access.modal = false
}
</script>

<template>
  <div class="w-full animate-fade-up">
    <!-- Page Title -->
    <div class="mb-8">
      <h2 class="font-display text-2xl font-bold text-sand-950 mb-1">
        帳號管理
      </h2>
      <p class="text-sm text-sand-500">
        管理系統使用者帳號
      </p>
    </div>

    <!-- Add Account Button -->
    <div class="mb-6">
      <UButton
        icon="i-lucide-user-plus"
        @click="openRegisterModal"
      >
        新增帳號
      </UButton>
    </div>

    <!-- User Table (Desktop) -->
    <div class="hidden lg:block bg-white rounded-2xl border border-sand-200 shadow-sm">
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
              權限
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
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="acc in user.access"
                  :key="acc"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sage-100 text-sage-700"
                >
                  {{ accessLabel(acc) }}
                </span>
                <span
                  v-if="!user.access?.length"
                  class="text-sand-400 text-xs"
                >
                  無權限
                </span>
              </div>
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
              <div class="flex gap-2">
                <UButton
                  variant="soft"
                  size="xs"
                  icon="i-lucide-shield"
                  @click="openAccessModal(user)"
                >
                  權限
                </UButton>
                <UButton
                  color="error"
                  variant="soft"
                  size="xs"
                  icon="i-lucide-trash-2"
                  @click="openDeleteModal(user.id)"
                >
                  刪除
                </UButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- User Cards (Mobile) -->
    <div class="lg:hidden space-y-3">
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-white rounded-2xl border border-sand-200 shadow-sm p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="font-medium text-sand-950">
              {{ user.name }}
            </p>
            <p class="text-xs text-sand-500 mt-0.5">
              {{ user.email }}
            </p>
          </div>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
          >
            {{ user.isBlocked ? '已封鎖' : '正常' }}
          </span>
        </div>
        <div class="flex flex-wrap items-center gap-1.5 mb-3">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="user.role === 'admin' ? 'bg-sage-100 text-sage-700' : 'bg-sand-100 text-sand-600'"
          >
            {{ roleLabel(user.role) }}
          </span>
          <span
            v-for="acc in user.access"
            :key="acc"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sage-100 text-sage-700"
          >
            {{ accessLabel(acc) }}
          </span>
          <span
            v-if="!user.access?.length"
            class="text-sand-400 text-xs"
          >
            無權限
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-sand-400">
            {{ user.createdAt }}
          </span>
          <div class="flex gap-2">
            <UButton
              variant="soft"
              size="xs"
              icon="i-lucide-shield"
              @click="openAccessModal(user)"
            >
              權限
            </UButton>
            <UButton
              color="error"
              variant="soft"
              size="xs"
              icon="i-lucide-trash-2"
              @click="openDeleteModal(user.id)"
            >
              刪除
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Modal -->
    <UModal v-model:open="state.feature.register.modal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-sand-950 mb-1">
            新增帳號
          </h3>
          <p class="text-sm text-sand-500 mb-5">
            建立新的系統使用者帳號
          </p>
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">姓名</label>
              <UInput
                v-model="state.feature.register.name"
                placeholder="請輸入姓名"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">電子信箱</label>
              <UInput
                v-model="state.feature.register.email"
                type="email"
                placeholder="請輸入電子信箱"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-sand-700 mb-1">密碼</label>
              <UInput
                v-model="state.feature.register.password"
                type="password"
                placeholder="請輸入密碼"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <UButton
              variant="outline"
              color="neutral"
              @click="state.feature.register.modal = false"
            >
              取消
            </UButton>
            <UButton
              color="primary"
              :loading="state.feature.register.loading"
              @click="confirmRegister"
            >
              建立
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirm Modal -->
    <UModal v-model:open="state.feature.delete.modal">
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
              @click="state.feature.delete.modal = false"
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

    <!-- Access Edit Modal -->
    <UModal v-model:open="state.feature.access.modal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-sand-950 mb-1">
            編輯權限
          </h3>
          <p class="text-sm text-sand-500 mb-5">
            {{ state.feature.access.targetName }}
          </p>
          <div class="space-y-3 mb-6">
            <button
              v-for="option in accessOptions"
              :key="option.value"
              class="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all"
              :class="state.feature.access.selected.includes(option.value)
                ? 'border-sage-300 bg-sage-50'
                : 'border-sand-200 bg-white hover:border-sand-300'"
              @click="toggleAccess(option.value)"
            >
              <span class="text-sm font-medium text-sand-950">
                {{ option.label }}
              </span>
              <UIcon
                :name="state.feature.access.selected.includes(option.value) ? 'i-lucide-check-circle' : 'i-lucide-circle'"
                :class="state.feature.access.selected.includes(option.value) ? 'text-sage-600' : 'text-sand-300'"
                class="text-lg"
              />
            </button>
          </div>
          <div class="flex justify-end gap-3">
            <UButton
              variant="outline"
              color="neutral"
              @click="state.feature.access.modal = false"
            >
              取消
            </UButton>
            <UButton
              color="primary"
              :loading="state.feature.access.loading"
              @click="confirmEditAccess"
            >
              儲存
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
