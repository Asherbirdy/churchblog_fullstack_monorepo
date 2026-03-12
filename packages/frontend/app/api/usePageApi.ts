import { useRequestApi } from '~/composables'
import type { RecordStatus } from '~/enum'
import { PublicRequestUrl, UserRequestUrl } from '~/enum'

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

export interface GetOnlinePagesResponse {
  onlinePages: {
    id: string
    name: string
    status: RecordStatus
  }[]
}

export interface GetPageByRouteNameResponse {
  page: Page
}

export interface GetOnlinePagesResponses {
  onlinePages: OnlinePage[]
}

export interface OnlinePage {
  id: string
  name: string
  status: string
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
      `${UserRequestUrl.PageUpdate}/${payload.id}`, {
        method: 'PATCH',
        body: payload.body,
        immediate: false,
        server: false,
        watch: false,
        lazy: true
      })
  },
  getOnline: async () => {
    return await useRequestApi<GetOnlinePagesResponses, never>(
      `${UserRequestUrl.PageOnline}`, {
        method: 'GET',
        server: false,
        lazy: false
      })
  },
  getByRouteName: async (routeName: string) => {
    return await useRequestApi<GetPageByRouteNameResponse, never>(
      `${PublicRequestUrl.PageRoute}/${routeName}`, {
        method: 'GET',
        lazy: true
      })
  }
}
