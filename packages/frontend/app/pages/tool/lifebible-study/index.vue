<script setup lang="ts">
interface Paragraph {
  id: string
  content: string
  dayIndex: number
  originalIndex: number
}

interface DraggedPara {
  para: Paragraph
  sourceDayIndex: number
  isFirstInDay: boolean
}

const dayLabels = ['週一', '週二', '週三', '週四', '週五', '週六', '主日']

const state = ref({
  data: {
    inputText: '',
    paragraphs: [] as Paragraph[],
    errorMessage: ''
  },
  feature: {
    copied: false,
    draggedPara: null as DraggedPara | null
  }
})

const distribution = computed(() => {
  const dist: Paragraph[][] = Array.from({ length: 7 }, () => [])
  state.value.data.paragraphs.forEach((para) => {
    dist[para.dayIndex]?.push(para)
  })
  return dist
})

const stats = computed(() =>
  distribution.value.map(day => day.reduce((sum, para) => sum + para.content.length, 0))
)

const totalChars = computed(() =>
  stats.value.reduce((sum, count) => sum + count, 0)
)

const hasResult = computed(() => state.value.data.paragraphs.length > 0)

const distributeParagraphs = () => {
  const text = state.value.data.inputText.trim()
  if (!text) return

  const paras = text.split(/\n\s*\n/).filter(p => p.trim())
  if (paras.length === 0) return

  const totalCharsCount = paras.reduce((sum, p) => sum + p.length, 0)
  const targetCharsPerDay = Math.ceil(totalCharsCount / 7)

  const newParagraphs: Paragraph[] = []
  let currentDayIndex = 0
  let currentCharCount = 0

  paras.forEach((content, index) => {
    const paraLength = content.length

    if (
      currentCharCount + paraLength > targetCharsPerDay
      && currentDayIndex < 6
      && newParagraphs.filter(p => p.dayIndex === currentDayIndex).length > 0
    ) {
      currentDayIndex++
      currentCharCount = 0
    }

    newParagraphs.push({
      id: `para-${index}`,
      content,
      dayIndex: currentDayIndex,
      originalIndex: index
    })
    currentCharCount += paraLength
  })

  state.value.data.paragraphs = newParagraphs
}

const canDrag = (para: Paragraph, dayContent: Paragraph[]) => {
  const paraIndexInDay = dayContent.findIndex(p => p.id === para.id)
  return paraIndexInDay === 0 || paraIndexInDay === dayContent.length - 1
}

const isFirst = (para: Paragraph, dayContent: Paragraph[]) =>
  dayContent.findIndex(p => p.id === para.id) === 0

const isLast = (para: Paragraph, dayContent: Paragraph[]) =>
  dayContent.findIndex(p => p.id === para.id) === dayContent.length - 1

const handleDragStart = (e: DragEvent, para: Paragraph, dayIndex: number, dayContent: Paragraph[]) => {
  if (!canDrag(para, dayContent)) {
    e.preventDefault()
    return
  }

  const paraIndexInDay = dayContent.findIndex(p => p.id === para.id)
  const isFirstInDay = paraIndexInDay === 0

  state.value.feature.draggedPara = {
    para,
    sourceDayIndex: dayIndex,
    isFirstInDay
  }

  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

const handleDrop = (e: DragEvent, targetDayIndex: number) => {
  e.preventDefault()

  const dragged = state.value.feature.draggedPara
  if (!dragged) return

  const { para, sourceDayIndex, isFirstInDay } = dragged

  let canMove = false
  let errorMsg = ''

  if (isFirstInDay && targetDayIndex === sourceDayIndex - 1) {
    canMove = true
  } else if (!isFirstInDay && targetDayIndex === sourceDayIndex + 1) {
    canMove = true
  } else if (isFirstInDay && targetDayIndex === sourceDayIndex + 1) {
    errorMsg = '頭部段落只能往前一天拖動'
  } else if (!isFirstInDay && targetDayIndex === sourceDayIndex - 1) {
    errorMsg = '尾部段落只能往後一天拖動'
  }

  if (!canMove) {
    if (errorMsg) {
      state.value.data.errorMessage = errorMsg
      setTimeout(() => {
        state.value.data.errorMessage = ''
      }, 3000)
    }
    state.value.feature.draggedPara = null
    return
  }

  state.value.data.paragraphs = state.value.data.paragraphs.map((p) => {
    if (p.id === para.id) {
      return { ...p, dayIndex: targetDayIndex }
    }
    return p
  })

  state.value.feature.draggedPara = null
}

const getResult = () => {
  let output = ''
  distribution.value.forEach((dayContent, index) => {
    output += `[${dayLabels[index]}]\n`
    if (dayContent.length > 0) {
      output += dayContent.map(p => p.content).join('\n\n')
    }
    if (index < 6) {
      output += '\n\n'
    }
  })
  return output
}

const copyToClipboard = async () => {
  const result = getResult()
  try {
    await navigator.clipboard.writeText(result)
    state.value.feature.copied = true
    setTimeout(() => {
      state.value.feature.copied = false
    }, 2000)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = result
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      state.value.feature.copied = true
      setTimeout(() => {
        state.value.feature.copied = false
      }, 2000)
    } catch {
      alert('複製失敗，請手動選取文字複製')
    }
    document.body.removeChild(textarea)
  }
}

const clearAll = () => {
  state.value.data.inputText = ''
  state.value.data.paragraphs = []
}
</script>

<template>
  <div class="h-screen flex flex-col bg-sand-50">
    <!-- Header -->
    <div
      v-if="!hasResult"
      class="bg-white border-b border-sand-200 px-6 py-4 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <UIcon
          name="i-lucide-calendar"
          class="text-sage-600 text-2xl"
        />
        <h1 class="font-display text-2xl font-bold text-sand-950">
          生命讀經每日分配
        </h1>
      </div>
      <p class="text-sm text-sand-500 mt-1">
        將文字內容平均分配到一週七天，可拖動每天的頭尾段落調整
      </p>
    </div>

    <!-- Stats bar -->
    <div
      v-if="hasResult"
      class="bg-white border-b border-sand-200 px-6 py-3 shadow-sm"
    >
      <div class="flex items-center gap-4">
        <UIcon
          name="i-lucide-calendar"
          class="text-sage-600 text-xl"
        />
        <h1 class="font-display text-lg font-bold text-sand-950">
          生命讀經每日分配
        </h1>
        <span class="text-xs text-sand-400">
          共 {{ totalChars }} 字
        </span>
      </div>
    </div>

    <!-- Error toast -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-5"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-5"
    >
      <div
        v-if="state.data.errorMessage"
        class="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div class="bg-warm-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <UIcon
            name="i-lucide-alert-triangle"
            class="text-lg"
          />
          <span class="font-medium text-sm">{{ state.data.errorMessage }}</span>
        </div>
      </div>
    </Transition>

    <!-- Main content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left: result columns or empty state -->
      <div
        :class="[
          'bg-white flex flex-col transition-all',
          hasResult ? 'w-full' : 'w-1/2 border-r border-sand-200'
        ]"
      >
        <div class="flex-1 overflow-x-auto overflow-y-hidden p-6">
          <!-- Distribution columns -->
          <div
            v-if="hasResult"
            class="flex gap-4 h-full min-w-max"
          >
            <div
              v-for="(dayContent, dayIndex) in distribution"
              :key="dayIndex"
              class="flex flex-col w-80 shrink-0 bg-sand-50 rounded-2xl border border-sand-200"
              @dragover="handleDragOver"
              @drop="handleDrop($event, dayIndex)"
            >
              <!-- Day header -->
              <div class="bg-sage-600 text-white px-4 py-3 rounded-t-2xl font-bold text-sm flex items-center justify-between">
                <span>{{ dayLabels[dayIndex] }}</span>
                <span class="text-xs font-normal opacity-90">
                  {{ dayContent.length }} 段落 · {{ stats[dayIndex] }} 字
                </span>
              </div>

              <!-- Day content -->
              <div class="flex-1 overflow-y-auto p-3 space-y-2 min-h-[200px]">
                <div
                  v-if="dayContent.length === 0"
                  class="text-sand-400 text-sm italic py-8 text-center border-2 border-dashed border-sand-300 rounded-xl"
                >
                  拖曳相鄰天的段落到此處
                </div>

                <div
                  v-for="para in dayContent"
                  :key="para.id"
                  :draggable="canDrag(para, dayContent)"
                  :class="[
                    'bg-white p-3 rounded-xl border transition-all',
                    canDrag(para, dayContent)
                      ? 'border-sand-200 hover:border-sage-400 hover:shadow-md cursor-move'
                      : 'border-sand-100 cursor-default'
                  ]"
                  @dragstart="handleDragStart($event, para, dayIndex, dayContent)"
                >
                  <div class="flex gap-2">
                    <div
                      v-if="canDrag(para, dayContent)"
                      class="flex flex-col justify-center items-center"
                    >
                      <UIcon
                        name="i-lucide-grip-vertical"
                        class="text-sage-400 text-sm"
                      />
                      <span
                        v-if="isFirst(para, dayContent) && dayIndex > 0"
                        class="text-[9px] text-sage-600 mt-0.5"
                      >
                        ←
                      </span>
                      <span
                        v-if="isLast(para, dayContent) && dayIndex < 6"
                        class="text-[9px] text-sage-600 mt-0.5"
                      >
                        →
                      </span>
                    </div>
                    <div
                      v-else
                      class="w-3 shrink-0"
                    />
                    <p class="text-xs text-sand-700 leading-relaxed flex-1">
                      {{ para.content }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-else
            class="flex items-center justify-center h-full text-sand-400"
          >
            <div class="text-center">
              <UIcon
                name="i-lucide-calendar"
                class="text-5xl mx-auto mb-3 opacity-50"
              />
              <p>輸入文字後點擊「開始分配」按鈕</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: text input (shown when no result) -->
      <div
        v-if="!hasResult"
        class="w-1/2 bg-white flex flex-col"
      >
        <div class="px-6 py-4 border-b border-sand-100 bg-sand-50">
          <h2 class="font-semibold text-sand-700">
            文字輸入
          </h2>
          <p class="text-xs text-sand-500 mt-1">
            以空行分隔段落
          </p>
        </div>

        <div class="flex-1 p-6">
          <textarea
            v-model="state.data.inputText"
            placeholder="請在此貼上文字內容...

段落之間請用空行分隔"
            class="w-full h-full p-4 border border-sand-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none text-sand-800 placeholder-sand-300"
          />
        </div>
      </div>
    </div>

    <!-- Footer actions -->
    <div class="bg-white border-t border-sand-200 px-6 py-4 shadow-lg">
      <div class="flex justify-center gap-4">
        <UButton
          label="開始分配"
          class="rounded-xl bg-sage-600 text-white hover:bg-sage-700 px-8"
          size="lg"
          :disabled="!state.data.inputText.trim()"
          @click="distributeParagraphs"
        />
        <UButton
          v-if="hasResult"
          :label="state.feature.copied ? '已複製' : '複製結果'"
          :icon="state.feature.copied ? 'i-lucide-check' : 'i-lucide-copy'"
          class="rounded-xl bg-sand-950 text-white hover:bg-sand-800 px-8"
          size="lg"
          @click="copyToClipboard"
        />
        <UButton
          label="清除"
          variant="soft"
          class="rounded-xl px-8"
          size="lg"
          @click="clearAll"
        />
      </div>
    </div>
  </div>
</template>
