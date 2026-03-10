import type { ShowMeResponse } from '~/type'

export const useUserStore = defineStore('user', () => {
  const user = ref<ShowMeResponse['user']>({
    id: '',
    name: '',
    email: ''
  })

  const userInfo = computed(() => user.value)

  const setUserInfo = (data: ShowMeResponse['user']) => user.value = data

  return {
    userInfo,
    setUserInfo
  }
})
