import { WebAuthRoutes } from '@monorepo/libs/enum'

export const useMenuStore = defineStore('menu', () => {
  const menuItems = ref([
    { label: '個人資料', icon: 'i-lucide-layout-dashboard', to: WebAuthRoutes.ADMIN_INDEX },
    { label: '聊天機器人', icon: 'i-lucide-bot', to: WebAuthRoutes.ADMIN_CHATBOT },
    { label: '一頁網站', icon: 'i-lucide-layout-template', to: WebAuthRoutes.ADMIN_WEBSITE }
  ])

  return {
    menuItems
  }
})
