import { WebRoutes } from '@monorepo/libs/enum'

export const useMenuStore = defineStore('menu', () => {
  const menuItems = ref([
    { label: '聊天機器人', icon: 'i-lucide-bot', to: WebRoutes.ADMIN_CHATBOT },
    { label: '一頁網站', icon: 'i-lucide-layout-template', to: WebRoutes.ADMIN_WEBSITE }
  ])

  return {
    menuItems
  }
})
