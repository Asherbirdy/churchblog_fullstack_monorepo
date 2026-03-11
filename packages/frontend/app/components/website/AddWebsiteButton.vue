<script setup lang="ts">
import { usePageApi } from '~/api'
import { UserRequestUrl } from '~/enum'

const showCreateModal = ref(false)

const createForm = ref({
  name: '',
  routeName: ''
})

const { execute } = await usePageApi.create(createForm.value)

const handleCreate = async () => {
  if (!createForm.value.name || !createForm.value.routeName) return
  await execute()
  createForm.value.name = ''
  createForm.value.routeName = ''
  showCreateModal.value = false
  clearNuxtData(UserRequestUrl.Page)
  await refreshNuxtData([UserRequestUrl.Page])
}
</script>

<template>
  <UButton
    label="新增網站"
    icon="i-lucide-plus"
    class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
    @click="showCreateModal = true"
  />

  <!-- Create Modal -->
  <UModal v-model:open="showCreateModal">
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
              v-model="createForm.name"
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
              v-model="createForm.routeName"
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
            @click="showCreateModal = false"
          />
          <UButton
            label="建立"
            class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
            @click="handleCreate"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
