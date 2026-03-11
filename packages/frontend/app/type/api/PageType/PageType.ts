export interface Page {
  id: string
  name: string
  routeName: string
  contentHtml: string
  status: string
  isEdit: boolean
  lastEditedAt: string
  createdById: string
  createdAt: string
  updatedAt: string
}

export interface GetAllPagesResponse {
  pages: Page[]
}
