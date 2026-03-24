<script setup lang="ts">
import { useUserStore } from '~/stores'

const { userInfo, isLoading } = storeToRefs(useUserStore())

const state = ref({
  data: {},
  feature: {
    isEditing: false,
    form: {
      name: '',
      email: ''
    }
  }
})
</script>

<template>
  <div class="max-w-2xl animate-fade-up">
    <!-- Page Title -->
    <div class="mb-8">
      <h2 class="font-display text-2xl font-bold text-sand-950 mb-1">
        個人資料
      </h2>
      <p class="text-sm text-sand-500">
        管理你的帳號資訊
      </p>
    </div>

    <!-- Profile Card -->
    <div class="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
      <!-- Avatar Section -->
      <div class="bg-sage-50 px-6 py-8 flex items-center gap-5 border-b border-sand-200">
        <div class="w-16 h-16 rounded-full bg-sage-200 flex items-center justify-center shrink-0">
          <UIcon
            name="i-lucide-user"
            class="text-sage-600 text-2xl"
          />
        </div>
        <div>
          <ClientOnly>
            <template v-if="isLoading">
              <div class="h-6 w-24 bg-sand-200 rounded animate-pulse mb-1" />
              <div class="h-4 w-48 bg-sand-100 rounded animate-pulse" />
            </template>
            <template v-else>
              <p class="text-lg font-semibold text-sand-950">
                {{ userInfo.name || '—' }}
              </p>
              <p class="text-sm text-sand-400 font-mono">
                {{ userInfo.id }}
              </p>
            </template>
            <template #fallback>
              <div class="h-6 w-24 bg-sand-200 rounded animate-pulse mb-1" />
              <div class="h-4 w-48 bg-sand-100 rounded animate-pulse" />
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Info Fields -->
      <div class="p-6 space-y-5">
        <!-- 姓名 -->
        <div>
          <label class="text-xs font-medium text-sand-400 uppercase tracking-wide mb-1.5 block">
            姓名
          </label>
          <div
            v-if="!state.feature.isEditing"
            class="flex items-center gap-3 text-sand-800"
          >
            <UIcon
              name="i-lucide-user"
              class="text-sand-400 shrink-0"
            />
            <ClientOnly>
              <template v-if="isLoading">
                <div class="h-4 w-20 bg-sand-200 rounded animate-pulse" />
              </template>
              <span
                v-else
                class="text-sm"
              >{{ userInfo.name || '—' }}</span>
              <template #fallback>
                <div class="h-4 w-20 bg-sand-200 rounded animate-pulse" />
              </template>
            </ClientOnly>
          </div>
          <UInput
            v-else
            v-model="state.feature.form.name"
            icon="i-lucide-user"
            size="lg"
            :ui="{ base: 'rounded-xl' }"
          />
        </div>

        <!-- 電子信箱 -->
        <div>
          <label class="text-xs font-medium text-sand-400 uppercase tracking-wide mb-1.5 block">
            電子信箱
          </label>
          <div
            v-if="!state.feature.isEditing"
            class="flex items-center gap-3 text-sand-800"
          >
            <UIcon
              name="i-lucide-mail"
              class="text-sand-400 shrink-0"
            />
            <ClientOnly>
              <template v-if="isLoading">
                <div class="h-4 w-36 bg-sand-200 rounded animate-pulse" />
              </template>
              <span
                v-else
                class="text-sm"
              >{{ userInfo.email || '—' }}</span>
              <template #fallback>
                <div class="h-4 w-36 bg-sand-200 rounded animate-pulse" />
              </template>
            </ClientOnly>
          </div>
          <UInput
            v-else
            v-model="state.feature.form.email"
            type="email"
            icon="i-lucide-mail"
            size="lg"
            :ui="{ base: 'rounded-xl' }"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="px-6 py-4 border-t border-sand-100 flex justify-end gap-3">
        <template v-if="state.feature.isEditing">
          <UButton
            label="取消"
            color="neutral"
            variant="outline"
            class="rounded-xl"
            @click="state.feature.isEditing = false"
          />
          <UButton
            label="儲存"
            class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
          />
        </template>
      </div>
    </div>
  </div>
</template>
