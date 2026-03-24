import Axios from './axios/Axios'
import _RequstInterceptors from './axios/requestInterceptors'
import { url } from './config'


const useApiRequest = new Axios({
  directlyGetData: false,
  baseURL: url,
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
