import { useUserApi } from '~/api'
import { PrivateRoutes } from '~/enum'
import { useUserStore } from '~/stores'

export default defineNuxtRouteMiddleware(async () => {
  console.log('middleware')

  const { setUserInfo } = useUserStore()
  const { data, error } = await useUserApi.showMe()

  if (error.value) {
    clearNuxtData() // 清掉 cache
    clearNuxtState()
    return navigateTo(PrivateRoutes.ADMIN_HOME)
  }

  if (data.value && !error.value) {
    setUserInfo(data.value.user)
  }
})
