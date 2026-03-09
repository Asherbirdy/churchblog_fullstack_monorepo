import type { FormItemRule } from 'naive-ui'

import { regex } from '../regex'
import { HospitalOption, SpecialtyOption } from '@/hooks'

export const formRules: Record<string, (message: string, options?: any)=> FormItemRule> = {
  /*
    select 必須有值
  */
  selectRequired: (message: string): FormItemRule =>
  ({
    required: true,
    trigger: ['blur', 'change'],
    message: message
  }),
  /*
    input 必須有值
  */
  inputRequired: (message: string): FormItemRule =>
  ({
    required: true,
    message: message,
    trigger: 'blur'
  }),
  /*
    checkbox group 必須有值
  */
  checkboxGroupRequired: (message: string): FormItemRule =>
  ({
    type: 'array',
    required: true,
    message: message
  }),
  /*
    必須符合 Email 格式
  */
  emailValidations: (message: string): FormItemRule => ({
    validator: (rule: FormItemRule, value: string): boolean => {
      if (!value) return true // 無資料不檢測
      return regex.email.test(value)
    },
    message: message,
    trigger: 'blur'
  }),
  /*
    必須符合 手機 格式
  */
  mobileValidations: (message: string): FormItemRule => ({
    validator: (rule: FormItemRule, value: string): boolean => {
      if (!value) return true // 無資料不檢測
      return regex.mobile.test(value)
    },
    message: message,
    trigger: 'blur'
  }),
  /*
    必須符合 中文 格式
  */
  chineseValidations: (message: string): FormItemRule => ({
    validator: (rule: FormItemRule, value: string): boolean => {
      if (!value) return true // 無資料不檢測
      return regex.chineseName.test(value)
    },
    message: message,
    trigger: 'blur'
  }),
  /*
    HCOValidations value 必須是 selectOptions.HCO 其中一個 hcoFullName
  */
    HCOValidations: (message: string, options: HospitalOption[]) => ({
      validator: (rule: FormItemRule, value: string): boolean => {
        if (!value) return true // 無資料不檢測
        return options.some(hco => hco.hcoFullName === value)
      },
      message: message,
      trigger: 'blur'
    }),
    /*
      specialtyValidations value 必須是 selectOptions.specialty 其中的資料
    */
    specialtyValidations: (message: string, options: SpecialtyOption[]): FormItemRule => ({
      validator: (rule: FormItemRule, value: string): boolean => {
        if (!value) return true // 無資料不檢測
        return options.some(specialty => specialty.specialtyChineseName === value)
      },
      message: message,
      trigger: 'blur'
    })
}
