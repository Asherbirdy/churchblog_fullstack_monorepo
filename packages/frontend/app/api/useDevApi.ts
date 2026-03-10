import { useRequestApi } from '~/composables'
import { PublicRequestUrl } from '~/enum'

export const useDevApi = {
  get: async () => {
    return await useRequestApi(PublicRequestUrl.DevCheckIp, {
      method: 'GET',
      server: false,
      lazy: true
    })
  }
}
