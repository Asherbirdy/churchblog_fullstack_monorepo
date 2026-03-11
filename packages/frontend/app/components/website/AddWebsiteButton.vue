<script setup lang="ts">
import { usePageApi } from '~/api'
import { UserRequestUrl } from '~/enum'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const { disabled } = toRefs(props)

const toast = useToast()
const state = ref({
  data: {
    name: '',
    routeName: ''
  },
  feature: {
    modal: false
  }
})

const { execute, error } = await usePageApi.create(state.value.data)

const handleCreate = async () => {
  if (!state.value.data.name || !state.value.data.routeName) return
  await execute()

  if (error.value?.data?.error === 'ROUTE_NAME_ALREADY_EXISTS') {
    console.log('error.value', error.value)
    toast.add({
      title: '路由名稱已存在',
      description: '請使用其他路由名稱',
      color: 'error'
    })
    return
  }

  state.value.data.name = ''
  state.value.data.routeName = ''
  state.value.feature.modal = false
  clearNuxtData(UserRequestUrl.Page)
  await refreshNuxtData([UserRequestUrl.Page])
}
</script>

<template>
  <UButton
    :disabled="disabled"
    label="新增網站"
    icon="i-lucide-plus"
    class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
    @click="state.feature.modal = true"
  />

  <!-- Create Modal -->
  <UModal v-model:open="state.feature.modal">
    <template #content>
      <div class="p-6">
        <h3 class="font-display text-lg font-bold text-sand-950 mb-6">
          新增一頁網站
        </h3>
        <div class="space-y-4">
          <div>
            <label class="text-xs font-medium text-sand-400 uppercase tracking-wide mb-1.5 block">
              網站名稱
            </label>
            <UInput
              v-model="state.data.name"
              placeholder="例：活動報名頁"
              icon="i-lucide-type"
              size="lg"
              :ui="{ base: 'rounded-xl' }"
            />
          </div>
          <div>
            <label class="text-xs font-medium text-sand-400 uppercase tracking-wide mb-1.5 block">
              路由名稱
            </label>
            <UInput
              v-model="state.data.routeName"
              placeholder="例：event-signup"
              icon="i-lucide-link"
              size="lg"
              :ui="{ base: 'rounded-xl' }"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <UButton
            label="取消"
            color="neutral"
            variant="outline"
            class="rounded-xl"
            @click="state.feature.modal = false"
          />
          <UButton
            :disabled="!state.data.name || !state.data.routeName"
            label="建立"
            class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
            @click="handleCreate"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
