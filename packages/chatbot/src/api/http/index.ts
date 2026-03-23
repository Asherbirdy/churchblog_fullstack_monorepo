import Axios from './axios/Axios'
import _RequstInterceptors from './axios/requestInterceptors'
import { url } from './config'


// ** Clicugo API（使用 dynamicBaseURL 動態獲取 baseURL，優先使用 ConfigStore 的 meta.domain）
const useApiRequest = new Axios({
  directlyGetData: true,
  baseURL: url, // * dynamicBaseURL 為跑函示的 baseUrl
  timeout: 1000 * 60 * 5,
  interceptors: _RequstInterceptors,
  abortRepetitiveRequest: true,
  retryConfig: {
    count: 0,
    waitTime: 0
  }
})

export {
  useApiRequest,
}
