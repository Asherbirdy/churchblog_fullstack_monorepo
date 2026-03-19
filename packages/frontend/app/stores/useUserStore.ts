import type { ShowMeResponse } from '~/type'

export const useUserStore = defineStore('user', () => {
  const state = ref({
    data: {
      id: '',
      name: '',
      email: '',
      role: '',
      access: [] as string[]
    },
    feature: {
      loading: false
    }
  })

  const userInfo = computed(() => state.value.data)
  const isLoading = computed(() => state.value.feature.loading)

  const setLoading = (value: boolean) => state.value.feature.loading = value
  const setUserInfo = (data: ShowMeResponse['user']) => state.value.data = data

  return {
    isLoading,
    userInfo,
    setLoading,
    setUserInfo
  }
})
