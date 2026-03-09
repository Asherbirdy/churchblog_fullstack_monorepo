<script setup lang="ts">
import { NLayoutHeader, NLayoutContent, NSpace, NH2, NP } from 'naive-ui'
import { config } from '@/config'
import { useLiff } from '@/composables/useLiff'

const { LIFF } = useLiff()

</script>

<template>
  <div>
    <n-layout-header>
      <n-layout-content
        content-style="
          background-color:#5b78c9;
          padding-top:10px;"
      >
        <n-space justify="center">
          <n-h2 class="text-white">
            LineOA Template
          </n-h2>
        </n-space>
      </n-layout-content>
    </n-layout-header>
    <n-layout-content class="mx-5% mt-8px">
      <n-space
        class="max-w-600px m-a"
        justify="center"
        vertical
      >
        <div>LiFF ID : {{ config.liffId }}</div>
        <div>現在環境 : {{ config.mode }}</div>
        <div>Axios Request URL : {{ config.apiUrl }}</div>
        <div>API 測試:</div>
      </n-space>
    </n-layout-content>
  </div>
</template>
