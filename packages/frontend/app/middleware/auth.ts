import { useUserApi } from '~/api'
import { PrivateRoutes } from '~/enum'
import { useUserStore } from '~/stores'

export default defineNuxtRouteMiddleware(async () => {
  const { setUserInfo, setLoading } = useUserStore()

  setLoading(true)
  const { data, error } = await useUserApi.showMe()
  setLoading(false)

  if (error.value) {
    clearNuxtData()
    clearNuxtState()
    return navigateTo(PrivateRoutes.ADMIN_HOME)
  }

  if (data.value && !error.value) {
    setUserInfo(data.value.user)
  }
})
