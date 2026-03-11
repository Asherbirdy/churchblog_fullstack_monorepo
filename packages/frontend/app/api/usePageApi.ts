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

export interface CreatePageError {
  data: {
    success: boolean
    error: 'ROUTE_NAME_ALREADY_EXISTS'
  }
}

export interface GetPageInfoResponse {
  page: Page
}

export const usePageApi = {
  getOne: async (id: string) => {
    return await useRequestApi<GetPageInfoResponse, never>(
      `${UserRequestUrl.Page}/${id}`, {
        method: 'GET',
        server: false,
        lazy: false
      })
  },
  create: async (body: { name: string, routeName: string }) => {
    return await useRequestApi<UserRequestUrl.Page, CreatePageError>(
      UserRequestUrl.Page, {
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
    return await useRequestApi<GetAllPagesResponse, never>(
      UserRequestUrl.Page, {
        method: 'GET',
        server: false,
        lazy: false,
        key: UserRequestUrl.Page,
        getCachedData: key => nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      })
  },
  update: async (id: string, body: Record<string, unknown>) => {
    return await useRequestApi(
      `${UserRequestUrl.Page}/${id}`, {
        method: 'PATCH',
        body
      })
  }
}
