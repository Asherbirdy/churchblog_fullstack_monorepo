import { PrivateRoutes } from '~/enum'

export const useMenuStore = defineStore('menu', () => {
  const menuItems = ref([
    { label: '個人資料', icon: 'i-lucide-layout-dashboard', to: PrivateRoutes.ADMIN_HOME },
    { label: '聊天機器人', icon: 'i-lucide-bot', to: PrivateRoutes.ADMIN_CHATBOT },
    { label: '一頁網站', icon: 'i-lucide-layout-template', to: PrivateRoutes.ADMIN_WEBSITE },
    { label: '圖片管理', icon: 'i-lucide-image', to: PrivateRoutes.ADMIN_IMAGE },
    { label: '帳號管理', icon: 'i-lucide-users', to: PrivateRoutes.ADMIN_ACCOUNT }
  ])

  return {
    menuItems
  }
})
