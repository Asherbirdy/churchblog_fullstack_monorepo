<script setup lang="ts">
import { useCounterStore } from '~/stores'

const counter = useCounterStore()

const state = ref({
  data: {
    user: {
      name: '王小明',
      email: 'xiaoming@example.com',
      phone: '0912-345-678',
      role: '管理員',
      joinedAt: '2024-03-15'
    }
  },
  feature: {
    isEditing: false
  }
})

const editForm = reactive({
  name: state.value.data.user.name,
  email: state.value.data.user.email,
  phone: state.value.data.user.phone
})

const profileFields = [
  { label: '姓名', key: 'name' as const, icon: 'i-lucide-user' },
  { label: '電子信箱', key: 'email' as const, icon: 'i-lucide-mail' },
  { label: '電話', key: 'phone' as const, icon: 'i-lucide-phone' }
]

const handleSave = () => {
  state.value.data.user.name = editForm.name
  state.value.data.user.email = editForm.email
  state.value.data.user.phone = editForm.phone
  state.value.feature.isEditing = false
}

const handleCancel = () => {
  editForm.name = state.value.data.user.name
  editForm.email = state.value.data.user.email
  editForm.phone = state.value.data.user.phone
  state.value.feature.isEditing = false
}
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

    <!-- Counter Test -->
    <div class="mb-8 bg-white rounded-2xl border border-sand-200 shadow-sm p-6">
      <h3 class="text-sm font-semibold text-sand-950 mb-4">
        Counter Store 測試
      </h3>
      <div class="flex items-center gap-4">
        <UButton
          icon="i-lucide-minus"
          color="neutral"
          variant="outline"
          class="rounded-xl"
          @click="counter.decrement()"
        />
        <span class="text-2xl font-bold text-sand-950 min-w-12 text-center">
          {{ counter.count }}
        </span>
        <UButton
          icon="i-lucide-plus"
          color="neutral"
          variant="outline"
          class="rounded-xl"
          @click="counter.increment()"
        />
        <UButton
          label="重設"
          color="neutral"
          variant="ghost"
          class="ml-2 text-sand-500"
          @click="counter.reset()"
        />
      </div>
      <p class="text-xs text-sand-400 mt-3">
        Double: {{ counter.doubleCount }}
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
          <p class="text-lg font-semibold text-sand-950">
            {{ state.data.user.name }}
          </p>
          <p class="text-sm text-sand-500">
            {{ state.data.user.role }} · 加入於 {{ state.data.user.joinedAt }}
          </p>
        </div>
      </div>

      <!-- Info Fields -->
      <div class="p-6 space-y-5">
        <div
          v-for="field in profileFields"
          :key="field.key"
        >
          <label class="text-xs font-medium text-sand-400 uppercase tracking-wide mb-1.5 block">
            {{ field.label }}
          </label>

          <!-- View Mode -->
          <div
            v-if="!state.feature.isEditing"
            class="flex items-center gap-3 text-sand-800"
          >
            <UIcon
              :name="field.icon"
              class="text-sand-400 shrink-0"
            />
            <span class="text-sm">{{ state.data.user[field.key] }}</span>
          </div>

          <!-- Edit Mode -->
          <UInput
            v-else
            v-model="editForm[field.key]"
            :icon="field.icon"
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
            @click="handleCancel"
          />
          <UButton
            label="儲存"
            class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
            @click="handleSave"
          />
        </template>
        <UButton
          v-else
          label="編輯資料"
          icon="i-lucide-pencil"
          class="rounded-xl bg-sand-950 text-white hover:bg-sand-800"
          @click="state.feature.isEditing = true"
        />
      </div>
    </div>
  </div>
</template>
