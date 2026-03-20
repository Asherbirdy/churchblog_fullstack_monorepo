import { useUserApi } from '~/api'
import { PrivateRoutes } from '~/enum'

export default defineNuxtRouteMiddleware(async () => {
  const { error } = await useUserApi.showMe()

  if (!error.value) {
    return navigateTo(PrivateRoutes.ADMIN_HOME)
  }
})
