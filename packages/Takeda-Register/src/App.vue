<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui'
import themeOverides from '@/theme'
import { gitBranch, gitCommit } from 'vite-git-info'

console.log(`GIT VERSION: ${gitBranch} (${gitCommit})`)

</script>
<template>
  <n-config-provider :theme-overrides="themeOverides">
    <n-dialog-provider>
      <n-message-provider>
        <RouterView />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
