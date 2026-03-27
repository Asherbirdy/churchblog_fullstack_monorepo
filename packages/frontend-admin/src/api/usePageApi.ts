import { useApiRequest } from './http'
import { AxiosPromise } from 'axios'
import { PrivateApiRoute, PublicApiRoute } from '@/enums'

export const usePageApi = {
  /*
   * 建立頁面
  */
  create: (payload: any): AxiosPromise<any> => {
    return useApiRequest.post({
      url: PrivateApiRoute.Page,
      data: payload,
    })
  },

  /*
   * 取得所有頁面
  */
  getAll: (): AxiosPromise<any> => {
    return useApiRequest.get({ url: PrivateApiRoute.Page })
  },

  /*
   * 取得單一頁面資訊
  */
  getOne: (id: string | number): AxiosPromise<any> => {
    return useApiRequest.get({ url: `${PrivateApiRoute.PageInfo}/${id}` })
  },

  /*
   * 取得所有上線頁面
  */
  getOnline: (): AxiosPromise<any> => {
    return useApiRequest.get({ url: PublicApiRoute.PageOnline })
  },

  /*
   * 依路由名稱取得頁面
  */
  getByRouteName: (routeName: string): AxiosPromise<any> => {
    return useApiRequest.get({ url: `${PublicApiRoute.PageRoute}/${routeName}` })
  },

  /*
   * 更新頁面
  */
  update: (id: string | number, payload: any): AxiosPromise<any> => {
    return useApiRequest.patch({
      url: `${PrivateApiRoute.PageUpdate}/${id}`,
      data: payload,
    })
  },

  /*
   * 更新頁面 HTML
  */
  editedHtml: (id: string | number, payload: any): AxiosPromise<any> => {
    return useApiRequest.patch({
      url: `${PrivateApiRoute.PageEditedHtml}/${id}`,
      data: payload,
    })
  },

  /*
   * 設定排程上線
  */
  setToOnlineScheduled: (id: string | number, payload: any): AxiosPromise<any> => {
    return useApiRequest.patch({
      url: `${PrivateApiRoute.PageSetToOnlineScheduled}/${id}`,
      data: payload,
    })
  },

  /*
   * 取消排程
  */
  cancelScheduled: (id: string | number): AxiosPromise<any> => {
    return useApiRequest.patch({ url: `${PrivateApiRoute.PageCancelScheduled}/${id}` })
  },

  /*
   * 設定排程下線
  */
  setToOfflineScheduled: (id: string | number, payload: any): AxiosPromise<any> => {
    return useApiRequest.patch({
      url: `${PrivateApiRoute.PageSetToOfflineScheduled}/${id}`,
      data: payload,
    })
  },

  /*
   * 回復上一個 HTML 版本
  */
  goToPreviousHtml: (id: string | number): AxiosPromise<any> => {
    return useApiRequest.patch({ url: `${PrivateApiRoute.PageGoToPreviousHtml}/${id}` })
  },

  /*
   * 佈署前置作業
  */
  beforeBuildAndDeploy: (): AxiosPromise<any> => {
    return useApiRequest.get({ url: PublicApiRoute.PageBeforeBuildAndDeploy })
  },

  /*
   * 重置頁面設定
  */
  reset: (): AxiosPromise<any> => {
    return useApiRequest.patch({ url: PrivateApiRoute.PageReset })
  },
}
