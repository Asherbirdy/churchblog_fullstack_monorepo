import { useUserApi } from '~/api'
import { PublicRoutes } from '~/enum'
import { useUserStore } from '~/stores'

export default defineNuxtRouteMiddleware(async () => {
  const { setUserInfo, setLoading } = useUserStore()

  setLoading(true)
  const { data, error } = await useUserApi.showMe()
  setLoading(false)

  if (error.value) {
    clearNuxtData()
    clearNuxtState()
    return navigateTo(PublicRoutes.LOGIN)
  }

  if (data.value && !error.value) {
    setUserInfo(data.value.user)
  }
})
