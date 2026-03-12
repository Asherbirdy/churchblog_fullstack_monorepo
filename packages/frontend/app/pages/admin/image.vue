<script setup lang="ts">
const state = ref({
  data: {
    images: [
      {
        id: '1',
        name: '主日崇拜封面',
        url: 'https://picsum.photos/seed/church1/400/300',
        folder: '崇拜',
        size: '2.4 MB',
        uploadedAt: '2026-03-10'
      },
      {
        id: '2',
        name: '小組聚會照片',
        url: 'https://picsum.photos/seed/church2/400/300',
        folder: '小組',
        size: '1.8 MB',
        uploadedAt: '2026-03-08'
      },
      {
        id: '3',
        name: '教會外觀',
        url: 'https://picsum.photos/seed/church3/400/300',
        folder: '教會',
        size: '3.1 MB',
        uploadedAt: '2026-03-05'
      },
      {
        id: '4',
        name: '青年團契活動',
        url: 'https://picsum.photos/seed/church4/400/300',
        folder: '團契',
        size: '2.0 MB',
        uploadedAt: '2026-03-03'
      },
      {
        id: '5',
        name: '聖誕節佈置',
        url: 'https://picsum.photos/seed/church5/400/300',
        folder: '節慶',
        size: '4.2 MB',
        uploadedAt: '2026-02-28'
      },
      {
        id: '6',
        name: '詩班練習',
        url: 'https://picsum.photos/seed/church6/400/300',
        folder: '崇拜',
        size: '1.5 MB',
        uploadedAt: '2026-02-25'
      },
      {
        id: '7',
        name: '兒童主日學',
        url: 'https://picsum.photos/seed/church7/400/300',
        folder: '教育',
        size: '2.7 MB',
        uploadedAt: '2026-02-20'
      },
      {
        id: '8',
        name: '洗禮典禮',
        url: 'https://picsum.photos/seed/church8/400/300',
        folder: '崇拜',
        size: '3.5 MB',
        uploadedAt: '2026-02-15'
      }
    ],
    folders: ['全部', '崇拜', '小組', '教會', '團契', '節慶', '教育']
  },
  feature: {
    activeFolder: '全部',
    viewMode: 'grid' as 'grid' | 'list',
    selectedImages: [] as string[]
  }
})

const filteredImages = computed(() => {
  if (state.value.feature.activeFolder === '全部') return state.value.data.images
  return state.value.data.images.filter(img => img.folder === state.value.feature.activeFolder)
})

const toggleSelect = (id: string) => {
  const idx = state.value.feature.selectedImages.indexOf(id)
  if (idx === -1) {
    state.value.feature.selectedImages.push(id)
  } else {
    state.value.feature.selectedImages.splice(idx, 1)
  }
}

const isSelected = (id: string) => state.value.feature.selectedImages.includes(id)

const selectedCount = computed(() => state.value.feature.selectedImages.length)

const clearSelection = () => {
  state.value.feature.selectedImages = []
}
</script>

<template>
  <div class="w-full animate-fade-up">
    <!-- Page Title -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h2 class="font-display text-2xl font-bold text-sand-950 mb-1">
          圖片管理
        </h2>
        <p class="text-sm text-sand-500">
          管理你的圖片素材庫
        </p>
      </div>
      <UButton
        icon="i-lucide-upload"
        label="上傳圖片"
        class="rounded-xl bg-sage-600 text-white hover:bg-sage-700"
      />
    </div>

    <!-- Toolbar -->
    <div class="flex items-center justify-between mb-6">
      <!-- Folder Filter -->
      <div class="flex gap-1 bg-sand-100 rounded-xl p-1 overflow-x-auto">
        <button
          v-for="folder in state.data.folders"
          :key="folder"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap"
          :class="state.feature.activeFolder === folder
            ? 'bg-white text-sand-950 shadow-sm'
            : 'text-sand-500 hover:text-sand-700'"
          @click="state.feature.activeFolder = folder"
        >
          {{ folder }}
        </button>
      </div>

      <!-- View Toggle -->
      <div class="flex items-center gap-1 bg-sand-100 rounded-xl p-1 ml-4 shrink-0">
        <button
          class="p-1.5 rounded-lg transition-all"
          :class="state.feature.viewMode === 'grid'
            ? 'bg-white text-sand-950 shadow-sm'
            : 'text-sand-400 hover:text-sand-600'"
          @click="state.feature.viewMode = 'grid'"
        >
          <UIcon
            name="i-lucide-grid-2x2"
            class="size-4"
          />
        </button>
        <button
          class="p-1.5 rounded-lg transition-all"
          :class="state.feature.viewMode === 'list'
            ? 'bg-white text-sand-950 shadow-sm'
            : 'text-sand-400 hover:text-sand-600'"
          @click="state.feature.viewMode = 'list'"
        >
          <UIcon
            name="i-lucide-list"
            class="size-4"
          />
        </button>
      </div>
    </div>

    <!-- Selection Bar -->
    <div
      v-if="selectedCount > 0"
      class="mb-4 flex items-center justify-between bg-sage-50 border border-sage-200 rounded-xl px-4 py-2.5"
    >
      <span class="text-sm text-sage-700 font-medium">
        已選擇 {{ selectedCount }} 張圖片
      </span>
      <div class="flex gap-2">
        <UButton
          icon="i-lucide-trash-2"
          label="刪除"
          variant="ghost"
          color="error"
          size="sm"
          class="rounded-lg"
        />
        <UButton
          icon="i-lucide-x"
          label="取消"
          variant="ghost"
          color="neutral"
          size="sm"
          class="rounded-lg"
          @click="clearSelection"
        />
      </div>
    </div>

    <!-- Grid View -->
    <div
      v-if="state.feature.viewMode === 'grid'"
      class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4"
    >
      <div
        v-for="image in filteredImages"
        :key="image.id"
        class="group relative bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer"
        :class="isSelected(image.id) ? 'ring-2 ring-sage-500 border-sage-300' : ''"
        @click="toggleSelect(image.id)"
      >
        <div class="aspect-4/3 overflow-hidden bg-sand-100">
          <img
            :src="image.url"
            :alt="image.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          >
        </div>
        <div class="p-3">
          <p class="text-sm font-medium text-sand-950 truncate">
            {{ image.name }}
          </p>
          <div class="flex items-center justify-between mt-1">
            <span class="text-xs text-sand-400">{{ image.size }}</span>
            <span class="text-xs text-sand-400 bg-sand-100 px-2 py-0.5 rounded-full">
              {{ image.folder }}
            </span>
          </div>
        </div>

        <!-- Selection Indicator -->
        <div
          class="absolute top-2 right-2 size-6 rounded-full border-2 flex items-center justify-center transition-all"
          :class="isSelected(image.id)
            ? 'bg-sage-600 border-sage-600'
            : 'border-white/80 bg-black/20 opacity-0 group-hover:opacity-100'"
        >
          <UIcon
            v-if="isSelected(image.id)"
            name="i-lucide-check"
            class="size-3.5 text-white"
          />
        </div>
      </div>
    </div>

    <!-- List View -->
    <div
      v-else
      class="space-y-2"
    >
      <div
        v-for="image in filteredImages"
        :key="image.id"
        class="bg-white rounded-2xl border border-sand-200 shadow-sm hover:shadow-md transition-shadow px-4 py-3 flex items-center gap-4 cursor-pointer"
        :class="isSelected(image.id) ? 'ring-2 ring-sage-500 border-sage-300' : ''"
        @click="toggleSelect(image.id)"
      >
        <!-- Checkbox -->
        <div
          class="size-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
          :class="isSelected(image.id)
            ? 'bg-sage-600 border-sage-600'
            : 'border-sand-300'"
        >
          <UIcon
            v-if="isSelected(image.id)"
            name="i-lucide-check"
            class="size-3 text-white"
          />
        </div>

        <!-- Thumbnail -->
        <div class="size-12 rounded-xl overflow-hidden bg-sand-100 shrink-0">
          <img
            :src="image.url"
            :alt="image.name"
            class="w-full h-full object-cover"
          >
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-sand-950 truncate">
            {{ image.name }}
          </p>
          <p class="text-xs text-sand-400">
            {{ image.uploadedAt }}
          </p>
        </div>

        <!-- Meta -->
        <span class="text-xs text-sand-400 bg-sand-100 px-2 py-0.5 rounded-full shrink-0">
          {{ image.folder }}
        </span>
        <span class="text-xs text-sand-400 shrink-0">
          {{ image.size }}
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredImages.length === 0"
      class="text-center py-16"
    >
      <UIcon
        name="i-lucide-image-off"
        class="size-12 text-sand-300 mx-auto mb-3"
      />
      <p class="text-sand-500 font-medium">
        此分類尚無圖片
      </p>
      <p class="text-sm text-sand-400 mt-1">
        點擊上方「上傳圖片」新增素材
      </p>
    </div>
  </div>
</template>
