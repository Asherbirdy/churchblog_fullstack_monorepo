import type { ShowMeResponse } from '~/type'

export function useUserStore() {
  const user = useState<ShowMeResponse['user']>('user', () => ({
    id: '',
    name: '',
    email: ''
  }))

  const userInfo = computed(() => user.value)

  const setUserInfo = (data: ShowMeResponse['user']) => user.value = data

  return {
    userInfo,
    setUserInfo
  }
}
