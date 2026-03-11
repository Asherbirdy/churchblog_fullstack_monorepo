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
      body
    })
  },
  getAll: async () => {
    return await useRequestApi<GetAllPagesResponse, never>(UserRequestUrl.Page, {
      method: 'GET',
      server: true
    })
  },
  update: async (id: string, body: Record<string, unknown>) => {
    return await useRequestApi(`${UserRequestUrl.Page}/${id}`, {
      method: 'PATCH',
      body
    })
  }
}
