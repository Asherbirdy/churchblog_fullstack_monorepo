import { useRequestApi } from '~/composables'
import { PublicRequestUrl } from '@monorepo/libs'

export const useDevApi = {
  get: async () => {
    return await useRequestApi(PublicRequestUrl.Dev, {
      method: 'GET',
      server: false,
      lazy: true
    })
  }
}
