import { CookieEnums, UserRequestUrl } from '~/enum'

export default defineNuxtPlugin(() => {
  const $Fetch = $fetch.create({
    async onRequest({ options, request }) {
      const config = useRuntimeConfig()

      // ['http://localhost:1207/api/v1/dev?test=123123', 'http://localhost:1207/api/v1/users/showMe']等...
      const PrivateApiUrls: string[] = Object.values(UserRequestUrl).map(
        url => `${config.public.API_URL}${url}`
      )

      // 如果 apiUrl 是 PrivateApiUrl, headers 需要有 Authorization Token
      if (PrivateApiUrls.some(url => (request as string).startsWith(url))) {
        const headers = await getAuthHeaders()
        options.headers = { ...options.headers, ...headers }
        return
      }

      // 如果 apiUrl 是 PublicRequestUrl, headers 不需要有 Authorization Token
      options.headers = { ...options.headers }
    },
    onResponseError({ response }) {
      let errorMessage
      switch (response.status) {
        case 400:
          errorMessage = '[ Client Error: 400 ] 客戶端錯誤，請求格式或參數有誤！'
          break
        case 401:
          errorMessage = '[ Client Error: 401 ] 身份認證未通過! 請重新登入！'
          // if (window.location.pathname !== '/login') {
          //   navigateTo('/login')
          // }
          break
        case 403:
          errorMessage = '[ Client Error: 403 ] 用戶已獲得授權，但訪問被禁止！'
          break
        case 404:
          errorMessage = '[ Client Error: 404 ] 找不到網頁 或 未知的請求！'
          break
        case 500:
          errorMessage = '[ Server Error: 500 ] 伺服器錯誤！'
          break
        case 503:
          errorMessage = '[ Server Error: 503 ] 服務器錯誤！'
          break
        default:
          errorMessage = '[ Unknown Error ] 未知錯誤！'
      }

      // if (window.location.pathname !== '/login') {
      console.error(errorMessage, response)
      // }
    }
  })

  return {
    provide: {
      Fetch: $Fetch
    }
  }
})

// refresh the accessToken using the refreshToken
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const config = useRuntimeConfig()
    const data = await $fetch<{
      jwtAccessToken: {
        accessTokenJWT: string
        refreshTokenJWT: string
      }
    }>(`${config.public.API_URL}/auth/refreshToken`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    })

    if (data && data.jwtAccessToken) {
      useCookie(CookieEnums.AccessToken).value = data.jwtAccessToken.accessTokenJWT
      useCookie(CookieEnums.RefreshToken).value = data.jwtAccessToken.refreshTokenJWT
      return data.jwtAccessToken.accessTokenJWT
    }
  } catch (error) {
    console.error('Failed to refresh token:', error)
  }
  return null
}

async function getAuthHeaders() {
  const accessToken = useCookie(CookieEnums.AccessToken).value
  const refreshToken = useCookie(CookieEnums.RefreshToken).value

  // if accessToken is present, return it
  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` }
  }

  // if refreshToken is present, refresh the accessToken
  if (refreshToken) {
    const newAccessToken = await refreshAccessToken(refreshToken)
    if (newAccessToken) {
      return { Authorization: `Bearer ${newAccessToken}` }
    }
  }

  return {}
}
