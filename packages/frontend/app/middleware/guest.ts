import { useUserApi } from '~/api'
import { CookieEnums, PrivateRoutes, PublicRoutes } from '~/enum'

export default defineNuxtRouteMiddleware(async (to) => {
  const refreshToken = useCookie(CookieEnums.RefreshToken).value

  if (!refreshToken) {
    if (to.path === PublicRoutes.LOGIN) return
    return navigateTo(PublicRoutes.LOGIN)
  }

  const { error } = await useUserApi.showMe()

  // 沒有ERROR 表示已經登入
  if (!error.value) {
    return navigateTo(PrivateRoutes.ADMIN_HOME)
  }
})
