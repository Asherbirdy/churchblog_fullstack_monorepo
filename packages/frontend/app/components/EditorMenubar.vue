<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

const toolbarItems = [
  { action: 'toggleBold', icon: 'i-lucide-bold', name: 'bold' },
  { action: 'toggleItalic', icon: 'i-lucide-italic', name: 'italic' },
  { action: 'toggleStrike', icon: 'i-lucide-strikethrough', name: 'strike' },
  { divider: true },
  { action: 'toggleHeading', icon: 'i-lucide-heading-1', name: 'heading', attrs: { level: 1 } },
  { action: 'toggleHeading', icon: 'i-lucide-heading-2', name: 'heading', attrs: { level: 2 } },
  { action: 'toggleHeading', icon: 'i-lucide-heading-3', name: 'heading', attrs: { level: 3 } },
  { divider: true },
  { action: 'toggleBulletList', icon: 'i-lucide-list', name: 'bulletList' },
  { action: 'toggleOrderedList', icon: 'i-lucide-list-ordered', name: 'orderedList' },
  { divider: true },
  { action: 'toggleBlockquote', icon: 'i-lucide-quote', name: 'blockquote' },
  { action: 'setHorizontalRule', icon: 'i-lucide-minus', name: 'horizontalRule' }
]

const runAction = (item: typeof toolbarItems[number]) => {
  if (!props.editor || item.divider) return
  const chain = props.editor.chain().focus()
  if (item.attrs) {
    ;(chain as any)[item.action](item.attrs).run()
  } else {
    ;(chain as any)[item.action]().run()
  }
}

const isActive = (item: typeof toolbarItems[number]) => {
  if (!props.editor || item.divider) return false
  if (item.attrs) return props.editor.isActive(item.name, item.attrs)
  return props.editor.isActive(item.name)
}
</script>

<template>
  <div class="flex items-center gap-0.5 px-2 py-1.5 border-b border-sand-100 bg-sand-50/50">
    <template
      v-for="(item, i) in toolbarItems"
      :key="i"
    >
      <div
        v-if="item.divider"
        class="w-px h-5 bg-sand-200 mx-1"
      />
      <button
        v-else
        class="p-1.5 rounded-lg transition-colors"
        :class="isActive(item)
          ? 'bg-sage-100 text-sage-700'
          : 'text-sand-500 hover:bg-sand-100 hover:text-sand-700'"
        @click="runAction(item)"
      >
        <UIcon
          :name="item.icon!"
          class="text-base"
        />
      </button>
    </template>
  </div>
</template>
