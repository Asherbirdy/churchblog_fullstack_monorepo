<script setup lang="ts">
import { useDevApi } from '~/api'

const { data } = await useDevApi.get()
</script>

<template>
  <div>DATA:{{ data }}</div>
</template>
