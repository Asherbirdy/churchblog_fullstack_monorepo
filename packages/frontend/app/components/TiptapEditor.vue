<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { EditorMenubar } from '~/components'

const model = defineModel<string>({ default: '' })

const editor = useEditor({
  content: model.value,
  extensions: [
    StarterKit,
    Image.configure({
      HTMLAttributes: {
        class: 'w-full rounded-lg'
      }
    })
  ],
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
    editor.value.commands.setContent(val)
  }
})
</script>

<template>
  <div class="w-full rounded-xl border border-sand-200 bg-white overflow-hidden">
    <template v-if="editor">
      <EditorMenubar :editor="editor" />
      <EditorContent :editor="editor" />
    </template>
  </div>
</template>
