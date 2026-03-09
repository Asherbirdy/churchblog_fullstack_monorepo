import Axios from './axios/Axios'
import _RequstInterceptors from './axios/requestInterceptors'
import {
  urlApi,
  googleSheetBaseURL
} from './config'

// ** 建立個 API 東東
const useApiRequest = new Axios({
  directlyGetData: true, // 是否直接返回 data 數據
  baseURL: urlApi,
  timeout: 1000 * 60 * 5, // 超時
  interceptors: _RequstInterceptors, // 定義攔截器
  abortRepetitiveRequest: true, // 是否取消重複請求
  retryConfig: {
    count: 0, // 重連次數
    waitTime: 0 // 每次重複請求間隔時間
  }
})

// ** 建立個 API 東東
const useSheetRequest = new Axios({
  directlyGetData: true, // 是否直接返回 data 數據
  baseURL: googleSheetBaseURL,
  timeout: 1000 * 60 * 5, // 超時
  interceptors: _RequstInterceptors, // 定義攔截器
  abortRepetitiveRequest: true, // 是否取消重複請求
  retryConfig: {
    count: 0, // 重連次數
    waitTime: 0 // 每次重複請求間隔時間
  }
})

export {
  useApiRequest,
  useSheetRequest
}
