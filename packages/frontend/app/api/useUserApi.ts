import { useRequestApi } from '~/composables'
import { UserRequestUrl } from '~/enum'

export const useUserApi = {
  showMe: async () => {
    return await useRequestApi(UserRequestUrl.UserShowMe, {
      method: 'GET',
    })
  },
}
