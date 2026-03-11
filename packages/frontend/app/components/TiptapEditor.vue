<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const model = defineModel<string>({ default: '' })

const editor = useEditor({
  content: model.value,
  extensions: [StarterKit],
  // immediatelyRender: false,
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none p-4 min-h-[240px] focus:outline-none text-left'
    }
  },
  onUpdate: ({ editor: e }) => {
    model.value = e.getHTML()
  }
})

watch(model, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val, false)
  }
})

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
  if (!editor.value || item.divider) return
  const chain = editor.value.chain().focus()
  if (item.attrs) {
    ;(chain as any)[item.action](item.attrs).run()
  } else {
    ;(chain as any)[item.action]().run()
  }
}

const isActive = (item: typeof toolbarItems[number]) => {
  if (!editor.value || item.divider) return false
  if (item.attrs) return editor.value.isActive(item.name, item.attrs)
  return editor.value.isActive(item.name)
}
</script>

<template>
  <div class="w-full rounded-xl border border-sand-200 bg-white overflow-hidden">
    <template v-if="editor">
      <!-- Toolbar -->
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

      <!-- Editor -->
      <EditorContent :editor="editor" />
    </template>
  </div>
</template>
