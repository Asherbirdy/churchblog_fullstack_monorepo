import { WebAuthRoutes } from '@monorepo/libs/enum'

export const useMenuStore = defineStore('menu', () => {
  const menuItems = ref([
    { label: '聊天機器人', icon: 'i-lucide-bot', to: WebAuthRoutes.ADMIN_CHATBOT },
    { label: '一頁網站', icon: 'i-lucide-layout-template', to: WebAuthRoutes.ADMIN_WEBSITE },
    { label: '儀表板', icon: 'i-lucide-layout-dashboard', to: WebAuthRoutes.ADMIN_INDEX }
  ])

  return {
    menuItems
  }
})
