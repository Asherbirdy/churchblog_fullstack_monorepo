import { useApiRequest } from '@/hooks/http'

interface checkLineIdPayload { lineId: string }
interface sendVerificationCodePayload { mobile: string }
interface hcpRegisterPayload {
  hcpUser: {
    name: string
    email: string
    mobile: string
    hcpRole: string
    sector: string
    verifiedSpecialty: string
    verifiedHospitalName: string
    token: string
    verificationCode: string
    profileId: string
    lineId: string
  }
}

interface internalUserPayload {
  internalUser: {
    firstName: string
    lastName: string
    email: string
    mobile: string
    token: string
    verificationCode: string
    profileId: string
    lineId: string
  }
}

export const useAuthApi = {
  /*
    檢查LineId是否已經綁定過
  */
  checkLineId: (payload: checkLineIdPayload) => {
    return useApiRequest.post({
      url: '/business/webservice/checkLineUser',
      data: payload
    })
  },
  /*
    傳送簡訊驗證
  */
  sendVerificationCode: (payload: sendVerificationCodePayload) => {
    return useApiRequest.post({
      url: '/business/webservice/sendVerificationCode',
      data: payload
    })
  },
  /*
    HCP 註冊
  */
  hcpRegister: (payload: hcpRegisterPayload) => {
    return useApiRequest.post({
      url: '/business/webservice/v1/bindHcpUser',
      data: payload
    })
  },
  /*
    Internal 註冊
  */
  internalRegister: (payload: internalUserPayload) => {
    return useApiRequest.post({
      url: '/business/webservice/v1/bindInternalUser',
      data: payload
    })
  }
}
