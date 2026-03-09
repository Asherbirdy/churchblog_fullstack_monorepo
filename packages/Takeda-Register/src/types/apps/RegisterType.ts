import { HCORadioEnums, SpecialtyRadioEnums, Role } from '@/enums'
import { HospitalOption, RoleOption, SpecialtyOption } from '@/hooks'
export interface RegisterState {
  role: Role
  form: null | HCPFormData | TakedaFormData
  isFormComplete: boolean
  goToRegisterPageBtn: boolean
  dialog: {
    hcp: {
      status: boolean
    }
    privacy: {
      status: boolean
    }
  },
  signature: {
    width: string
    height: string
    status: boolean
    image: null | Blob
    clear: ()=> void
    signEnd: ()=> void
  },
  currentPage: number
  resultMessage: string
  submitLoading: boolean
}

export interface HCPFormData {
  hcpUser?: any
  hcpRole: string | null
  // name: string
  firstName: string
  lastName: string
  sector: 'HP' | 'GP' | 'DS'
  verifiedHospitalName: string
  token: string
  verifiedSpecialty: string | undefined
  email: string
  mobile: string | null
  verificationCode: string
  profileId: string
  lineId: string
  mediaSource: string
  activitySource: string
  invitedBu: string
  invitedTeam: string
  invitedSales: string
  agreement: string[]
  options: {
    specialty: SpecialtyOption[],
    HCO: HospitalOption[],
    role: RoleOption[]
  }
}

export interface TakedaFormData {
  hcpUser?:any
  firstName?: string
  lastName?: string
  name: string
  email: string
  mobile: string | null
  verificationCode: string
  token: string
  profileId: string
  lineId: string
}

export interface HCPRegisterFormState {
  form: HCPFormData,
  verificationCodeForChecking: string,
  radio: {
    HCO: {
      status: HCORadioEnums
      toggleToOther: ()=> void
    }
    specialty: {
      status: SpecialtyRadioEnums
    }
  }
  options: {
    specialty: SpecialtyOption[],
    HCO: HospitalOption[],
    role: RoleOption[]
  }
}

export interface TakedaRegisterFormState {
  form: TakedaFormData
  verificationCodeForChecking: string
}