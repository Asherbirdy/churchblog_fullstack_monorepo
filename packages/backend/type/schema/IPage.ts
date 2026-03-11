export interface IPage {
  id: string
  name: string
  routeName: string
  contentHtml: string
  status: string
  isEdit: boolean
  isScheduled: boolean
  lastEditedAt: Date
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export type IPageUpdate = Partial<Pick<IPage, 'name' | 'contentHtml' | 'status' | 'isEdit' | 'isScheduled' | 'lastEditedAt'>>
