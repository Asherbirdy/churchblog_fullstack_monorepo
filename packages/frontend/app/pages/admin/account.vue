<script setup lang="ts">
const state = ref({
  data: {
    users: [
      { id: '1', name: '王小明', email: 'ming@example.com', role: 'admin', isBlocked: false, createdAt: '2025-12-01' },
      { id: '2', name: '李美麗', email: 'meili@example.com', role: 'user', isBlocked: false, createdAt: '2026-01-15' },
      { id: '3', name: '張大華', email: 'dahua@example.com', role: 'user', isBlocked: true, createdAt: '2026-02-20' },
      { id: '4', name: '陳志偉', email: 'zhiwei@example.com', role: 'user', isBlocked: false, createdAt: '2026-03-05' },
      { id: '5', name: '林雅婷', email: 'yating@example.com', role: 'admin', isBlocked: false, createdAt: '2026-03-10' }
    ]
  },
  feature: {}
})

const roleLabel = (role: string) => role === 'admin' ? '管理員' : '一般用戶'
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
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in state.data.users"
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
