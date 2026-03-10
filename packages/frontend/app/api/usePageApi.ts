import { useRequestApi } from '~/composables'
import { UserRequestUrl } from '~/enum'

export const usePageApi = {
  create: async (body: { name: string, routeName: string }) => {
    return await useRequestApi(UserRequestUrl.Page, {
      method: 'POST',
      body
    })
  },
  getAll: async () => {
    return await useRequestApi(UserRequestUrl.Page, {
      method: 'GET'
    })
  },
  update: async (id: string, body: Record<string, unknown>) => {
    return await useRequestApi(`${UserRequestUrl.Page}/${id}`, {
      method: 'PATCH',
      body
    })
  }
}
