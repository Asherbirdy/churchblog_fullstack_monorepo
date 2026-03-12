<script setup lang='ts'>
import { usePageApi } from '~/api'

const route = useRoute()
const routeName = route.params.routeName as string

const { data, error } = await usePageApi.getByRouteName(routeName)

onMounted(() => {
  console.log('ROUTE NAME:', route.params.routeName)
  console.log('DATA:', data.value)
  console.log('ERROR:', error.value)
})
</script>

<template>
  <div class="min-h-screen bg-sand-50">
    <div>asdass</div>
    <pre class="text-blue-500">
      DATA: {{ data?.page?.contentHtml }}
    </pre>
    <p class="text-red-500">
      ERROR: {{ error }}
    </p>

    <div
      v-if="data?.page"
      class="prose prose-sand mx-auto max-w-4xl px-6 py-8"
      v-html="data.page.contentHtml"
    />
  </div>
</template>
