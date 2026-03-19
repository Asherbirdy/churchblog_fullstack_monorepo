import { PrivateRoutes, Role } from '~/enum'
import { useUserStore } from '~/stores/useUserStore'

export const useMenuStore = defineStore('menu', () => {
  const { userInfo } = storeToRefs(useUserStore())

  const adminMenu = [
    { label: '帳號管理', icon: 'i-lucide-users', to: PrivateRoutes.ADMIN_ACCOUNT }
  ]

  const menuItems = computed(() => [
    { label: '個人資料', icon: 'i-lucide-layout-dashboard', to: PrivateRoutes.ADMIN_HOME },
    { label: '一頁網站', icon: 'i-lucide-layout-template', to: PrivateRoutes.ADMIN_WEBSITE },
    ...userInfo.value.role === Role.admin ? adminMenu : []
    // { label: '聊天機器人', icon: 'i-lucide-bot', to: PrivateRoutes.ADMIN_CHATBOT },
    // { label: '圖片管理', icon: 'i-lucide-image', to: PrivateRoutes.ADMIN_IMAGE },
  ])

  return {
    menuItems
  }
})
