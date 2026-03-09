import { urlFunc } from '@/utils'

// 根據環境來打代理伺服器或直接打API
const urlApi = urlFunc()

// Google Sheet API
const googleSheetBaseURL = 'https://script.google.com/macros/s/'

export {
  urlApi,
  googleSheetBaseURL
}