<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/no-v-html -->
<script setup lang='ts'>
import { usePageApi } from '~/api'

const route = useRoute()
const routeName = route.params.routeName as string

const { data } = await usePageApi.getByRouteName(routeName)
</script>

<template>
  <div class="min-h-screen bg-sand-50">
    /* eslint-disable-next-line vue/no-v-html */
    <div
      v-if="data?.page"
      class="prose prose-sand mx-auto max-w-4xl px-6 py-8"
      v-html="data.page.onlineHtml"
    />
  </div>
</template>
