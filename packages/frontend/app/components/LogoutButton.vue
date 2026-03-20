<script setup lang="ts">
import { useAuthApi } from '~/api'
import { PublicRoutes, CookieEnums } from '~/enum'

defineProps<{
  collapsed: boolean
}>()

const handleLogout = async () => {
  await useAuthApi.logout()

  const accessToken = useCookie(CookieEnums.AccessToken)
  const refreshToken = useCookie(CookieEnums.RefreshToken)
  accessToken.value = null
  refreshToken.value = null

  navigateTo(PublicRoutes.LOGIN)
}
</script>

<template>
  <button
    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sand-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
    @click="handleLogout"
  >
    <UIcon
      name="i-lucide-log-out"
      class="text-lg shrink-0 text-sand-400 group-hover:text-red-500"
    />
    <span
      v-show="!collapsed"
      class="text-sm font-medium truncate"
    >
      登出
    </span>
  </button>
</template>
