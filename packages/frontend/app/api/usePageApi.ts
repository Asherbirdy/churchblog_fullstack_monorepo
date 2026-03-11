import { useRequestApi } from '~/composables'
import type { RecordStatus } from '~/enum'
import { UserRequestUrl } from '~/enum'

export interface GetAllPagesResponse {
  pages: Page[]
}

export interface Page {
  id: string
  name: string
  routeName: string
  contentHtml: string
  status: RecordStatus
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

export interface UpdatePagePayload {
  id: string
  body: {
    name: string
    status: RecordStatus
    contentHtml: string
    isEdit: boolean
  }
}

export interface CreatePagePayload {
  name: string
  routeName: string
}

export const usePageApi = {
  getOne: async (id: string) => {
    return await useRequestApi<GetPageInfoResponse, never>(
      `${UserRequestUrl.PageInfo}/${id}`, {
        method: 'GET',
        server: false,
        lazy: false
      })
  },
  create: async (payload: CreatePagePayload) => {
    return await useRequestApi<UserRequestUrl.Page, CreatePageError>(
      UserRequestUrl.Page, {
        method: 'POST',
        body: payload,
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
  update: async (payload: UpdatePagePayload) => {
    return await useRequestApi(
      `${UserRequestUrl.Page}/${payload.id}`, {
        method: 'PATCH',
        body: payload.body,
        immediate: false,
        server: false,
        watch: false,
        lazy: true
      })
  }
}
