import { useApiRequest } from '@/hooks/http'


export interface OptionResponse {
  data: OptionData
  success: boolean
}

export interface OptionData {
  specialtyOptions: SpecialtyOption[]
  hospitalOptions: HospitalOption[]
  roleOptions: RoleOption[]
}

export interface SpecialtyOption {
  specialty: string
  code: string
  specialtyChineseName: string
}

export interface HospitalOption {
  hcoShortName: string
  hcoFullName: string
  externalID: string
}

export interface RoleOption {
  code: string
  title: string
  titleChineseName: string
}


export const useOptionApi = {
  getAllOptions: () : Promise<OptionResponse> => {
    return useApiRequest.get({
      url: '/business/webservice/getVerificationOptions',
    })
  }
}