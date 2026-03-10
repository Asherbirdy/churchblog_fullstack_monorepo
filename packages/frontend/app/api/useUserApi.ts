import { useRequestApi } from '~/composables'
import { UserRequestUrl } from '~/enum'
import type { ShowMeResponse } from '~/type'

export const useUserApi = {
  showMe: async () => {
    const nuxtApp = useNuxtApp()
    return await useRequestApi<ShowMeResponse, unknown>(UserRequestUrl.UserShowMe, {
      method: 'GET',
      server: false,
      lazy: true,
      key: UserRequestUrl.UserShowMe,
      getCachedData: key => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    })
  }
}
