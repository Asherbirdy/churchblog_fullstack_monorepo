import {
  LoginPayload, LoginResponse, LoginSendOtpPayload, LoginSendOtpResponse,
} from '@/types'
import { useApiRequest } from './http'
import { AxiosPromise } from 'axios'
import { PublicApiRoute } from '@/enums'

export const useAuthApi = {
  /*
   * 發送登入OTP
  */
  loginSendOtp: (payload: LoginSendOtpPayload): AxiosPromise<LoginSendOtpResponse> => {
    return useApiRequest.post({
      url: PublicApiRoute.AuthLoginSendOtp,
      data: payload,
    })
  },
  /*
   * 登入
  */
  login: (payload: LoginPayload): AxiosPromise<LoginResponse> => {
    return useApiRequest.post({
      url: PublicApiRoute.AuthLogin,
      data: payload,
    })
  },
  // sendOTPtoEmail: (payload: SendOTPtoEmailPayload) => {
  //   return useApiRequest.post({
  //     url: PrivateApiRoute.AuthSendOTP,
  //     data: payload,
  //   })
  // },
  // register: (payload: RegisterPayload) => {
  //   return useApiRequest.post({
  //     url: PrivateApiRoute.AuthRegister,
  //     data: payload,
  //   })
  // },
  // checkLogin: (): AxiosPromise<CheckLoginResponse> => {
  //   return useApiRequest.get({ url: PublicApiRoute.AuthCheckLogin })
  // },
  // logout: (): AxiosPromise<void> => {
  //   return useApiRequest.delete({ url: PublicApiRoute.AuthLogout })
  // },
}
