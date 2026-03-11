import { useRequestApi } from '~/composables'
import { UserRequestUrl } from '~/enum'

export interface GetAllPagesResponse {
  pages: Page[]
}

export interface Page {
  id: string
  name: string
  routeName: string
  contentHtml: string
  status: string
  isEdit: boolean
  isScheduled: boolean
  lastEditedAt: string
  createdById: string
  createdAt: string
  updatedAt: string
}

export const usePageApi = {
  create: async (body: { name: string, routeName: string }) => {
    return await useRequestApi(UserRequestUrl.Page, {
      method: 'POST',
      body,
      immediate: false,
      server: false,
      watch: false,
      lazy: true
    })
  },
  getAll: async () => {
    const nuxtApp = useNuxtApp()
    return await useRequestApi<GetAllPagesResponse, never>(UserRequestUrl.Page, {
      method: 'GET',
      server: false,
      lazy: false,
      key: UserRequestUrl.Page,
      getCachedData: key => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    })
  },
  update: async (id: string, body: Record<string, unknown>) => {
    return await useRequestApi(`${UserRequestUrl.Page}/${id}`, {
      method: 'PATCH',
      body
    })
  }
}
