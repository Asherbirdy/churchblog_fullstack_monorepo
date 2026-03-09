<script setup lang='ts'>
/* 需要注意的 業務邏輯
  這是 HCP 頁面， 也是所有醫生都可以註冊的頁面，之後補上...
*/
import { NForm, NFormItem, NSelect, NInput, NAutoComplete, NCheckboxGroup, NCheckbox, NSpace, NRadioGroup, NRadioButton, NInputGroup, NRadio, NFlex, NP } from 'naive-ui'
import { useOptionApi } from '@/hooks/apis/useOptionApi'
import { useSheetApi } from '@/hooks/apis/useSheetApi'
import { terms } from '@/constant'
import { HCORadioEnums, SpecialtyRadioEnums } from '@/enums'
import { selectOption, formRules, regex } from '@/utils'
import { useLocalStorage, useDebounceFn } from '@vueuse/core'
import type { HCPRegisterFormState } from '@/types'
import type {  FormInst, FormItemRule } from 'naive-ui'

const route = useRoute()
const emit = defineEmits(['updateForm', 'isFormComplete'])
const props = defineProps<{ lineUserId?: string }>()

// useLocalStorage 來管理表單暫存
const formStorage = useLocalStorage('hcp-register-form', {
  firstName: '', // 英文姓名 測試用：王柏元
  lastName: '', // 英文姓名 測試用：柏元
  email: '', // 電子信箱
  mobile: '' as string | null, // 手機號碼
  hcpRole: null as string | null, // 醫療人員類別
  sector: 'HP' as 'HP' | 'GP' | 'DS', // 醫療院所 或 其他
  verifiedSpecialty: '' as string | undefined, // 科別
  verifiedHospitalName: '', // 醫療機構
  token: '', // 手機的Token
  verificationCode: '', // 手機驗證碼
  profileId: '', // 安永(Chat server) 的 profileId 在 queryString 上的
  lineId: '', // 安永(Chat server) 的 profileId 在 queryString 上的
  mediaSource: '', // 安永(Chat server) 的 profileId 在 queryString 上的
  activitySource: '', // 安永(Chat server) 的 profileId 在 queryString 上的
  invitedBu: '', // 安永(Chat server) 的 profileId 在 queryString 上的
  invitedTeam: '', // 安永(Chat server) 的 profileId 在 queryString 上的
  invitedSales: '', // 安永(Chat server) 的 profileId 在 queryString 上的
  agreement: ['agreement1'] as string[], // 下面兩個勾選
  options: {
    specialty: [] as any[],
    HCO: [] as any[],
    role: [] as any[]
  },
  radio: {
    HCOStatus: HCORadioEnums.CurrentHCO,
    specialtyStatus: SpecialtyRadioEnums.CurrentSpecialty
  }
})

const state = ref<HCPRegisterFormState>({
  form: { ...formStorage.value },
  verificationCodeForChecking: '',
  radio: {
    HCO: {
      status: formStorage.value.radio?.HCOStatus || HCORadioEnums.CurrentHCO,
      toggleToOther: () => {
        state.value.form.verifiedHospitalName = ''
        state.value.radio.HCO.status = HCORadioEnums.OtherHCO
        nextTick(() => {
          HCOinput.value?.focus()
        })
      }
    },
    specialty: {
      status: formStorage.value.radio?.specialtyStatus || SpecialtyRadioEnums.CurrentSpecialty
    }
  },
  options: formStorage.value.options
})

/*
  * 監聽 state.form 變化，自動同步到 localStorage
*/
watch(() => state.value.form, (newForm) => {
  // 只更新 form 相關的字段，保留 options 和 radio
  Object.assign(formStorage.value, newForm)
}, { deep: true })

/*
  * 監聽 state.options 變化，自動同步到 localStorage
*/
watch(() => state.value.options, (newOptions) => {
  formStorage.value.options = { ...newOptions }
}, { deep: true })

/*
  * 監聽 radio status 變化，自動同步到 localStorage
*/
watch(() => state.value.radio.HCO.status, (newStatus) => {
  if (!formStorage.value.radio) {
    formStorage.value.radio = { HCOStatus: HCORadioEnums.CurrentHCO, specialtyStatus: SpecialtyRadioEnums.CurrentSpecialty }
  }
  formStorage.value.radio.HCOStatus = newStatus
})

watch(() => state.value.radio.specialty.status, (newStatus) => {
  if (!formStorage.value.radio) {
    formStorage.value.radio = { HCOStatus: HCORadioEnums.CurrentHCO, specialtyStatus: SpecialtyRadioEnums.CurrentSpecialty }
  }
  formStorage.value.radio.specialtyStatus = newStatus
})

/*
  * 處理姓名變動時的 API 呼叫
*/ 
const handleNameChange = async () => {
  const { lastName, firstName } = state.value.form

  // 檢查姓和名都有值
  if (!lastName || !firstName) {
    console.log('姓和名有一項沒有值，不觸發存入google表單');
    return
  }

  if (!regex.chineseName.test(lastName) || !regex.chineseName.test(firstName)) {
    return
  }

    // 紀錄到 Google Sheet
    await useSheetApi.post({
      lineId: props.lineUserId || '',
    })
}

// 使用 debounce 包裝處理函數，延遲 500ms
const debouncedHandleNameChange = useDebounceFn(handleNameChange, 2000)

// 標籤的 ref
const formRef = ref<FormInst>()
const HCOinput = ref<HTMLInputElement>()

const medicalPersonalOptions = computed(() => {
  return state.value.options.role.map(role => ({
    label: role.titleChineseName,
    value: role.code
  }))
})

const specialtyOptions = computed(() => {
  return state.value.options.specialty.map(item => ({
    label: item.specialtyChineseName,
    value: item.code
  }))
})

// 每個欄位的的 Rules 因為有動態規則所以 需要用computed
const rules = computed(() => {
  const dynamicRules = {
    hcpRole: formRules.selectRequired('請選擇您的醫療人員類別'),
    firstName: [
      formRules.inputRequired('請輸入您的中文姓'),
      formRules.chineseValidations('您輸入的內容必須要符合中文格式')
    ],
    lastName: [
      formRules.inputRequired('請輸入您的中文名'),
      formRules.chineseValidations('您輸入的內容必須要符合中文格式')
    ],
    verifiedHospitalName: [formRules.inputRequired('請輸入您所屬的醫療機構')],
    verifiedSpecialty: [formRules.selectRequired('請選擇/輸入您的醫療科別')],
    email: [
      formRules.inputRequired('請輸入您的電子信箱'),
      formRules.emailValidations('您輸入的內容必須要符合電子信箱格式')
    ],
    mobile: [
      formRules.inputRequired('請輸入您的手機號碼'),
      formRules.mobileValidations('您輸入的內容必須要符合手機號碼格式')
    ],
    verificationCode: [
      formRules.inputRequired('請輸入手機驗證碼'),
      {
        validator: (_rule: FormItemRule, value: string): boolean => {
          if (!value) return true // 無資料不檢測
          return value === state.value.verificationCodeForChecking
        },
        message: '請輸入正確的手機驗證碼',
        trigger: 'blur'
      }
    ],
    agreementGroup: formRules.checkboxGroupRequired('請勾選所有的協議與條款')
  }

  // 如果 HCO radio 是 'Current'，verifiedHospitalName 多一個驗證方式 rules，必須是json檔案裡面的值
  if (state.value.radio.HCO.status === HCORadioEnums.CurrentHCO && Array.isArray(dynamicRules.verifiedHospitalName)) {
    dynamicRules.verifiedHospitalName.push(
      formRules.HCOValidations('請輸入一個醫療機構', state.value.options.HCO)
    )
  }

  // 如果 Speciaty radio 是 'Current'，verifiedSpecialty多一個驗證rules，必須選裡面的參數
  if (state.value.radio.specialty.status === SpecialtyRadioEnums.CurrentSpecialty && Array.isArray(dynamicRules.verifiedSpecialty)) {
    dynamicRules.verifiedSpecialty.push(
      formRules.specialtyValidations('請輸入一個醫療科別', state.value.options.specialty)
    )
  }

  return dynamicRules
})

const autoCompleteEmailOptions = computed(() =>
  ['@gmail.com', '@yahoo.com'].map(suffix => ({
    label: state.value.form.email.split('@')[0] + suffix,
    value: state.value.form.email.split('@')[0] + suffix
  }))
)
// HCO autocompelete 的 過濾列表
const filteredHCOOptions = computed(() => {
  const HCO = state.value.form.verifiedHospitalName || ''
  if (!HCO) {
    return state.value.options.HCO
  }

  // 過濾選項，使其包含 HCO 的簡稱 還也 全名
  const filteredOptions = state.value.options.HCO.filter(item => {
    return item.hcoShortName.includes(HCO) || item.hcoFullName.includes(HCO)
  })

  return filteredOptions.map(value => ({
    label: value.hcoFullName,
    value: value.externalID
  }))
})


// 過濾選項，使其包含 Specialty 的簡稱 還也 全名
const filteredSpecialtyOptions = computed(() => {
  const specialty = state.value.form.verifiedSpecialty || ''
  if (!specialty) {
    return state.value.options.specialty
  }

  const filteredOptions = specialtyOptions.value.filter(item => {
    return item.label.includes(specialty)
  })
  return filteredOptions
})

// 監聽 sector 的變化 (切換 sector 的時候)
watch(() => state.value.form.sector, (newSector) => {
  switch (newSector) {
    case 'GP':
      state.value.radio.HCO.status = HCORadioEnums.OtherHCO
      break
    case 'HP':
      state.value.radio.HCO.status = HCORadioEnums.CurrentHCO
      break
    case 'DS':
      state.value.radio.HCO.status = HCORadioEnums.OtherHCO
      break
  }
  state.value.form.verifiedHospitalName = ''
})

// 當表單資料有變化 和 二次檢查
watch(state.value.form, () => {
  const { form } = state.value

  // 如果 state.value.radio.HCO.status 不是 'OthersHCO'(自填input) 狀態則檢查是否為預設的 HCO
  const isHCOValid = () => state.value.radio.HCO.status === HCORadioEnums.OtherHCO ||
    state.value.options.HCO.some(
      hco => hco.hcoFullName === form.verifiedHospitalName
    )

  const isSpecialtyValid = () => state.value.radio.specialty.status === SpecialtyRadioEnums.OtherSpecialty ||
    specialtyOptions.value.some(
      specialty => specialty.label === form.verifiedSpecialty
    )

  const check = (
    form.hcpRole &&
    form.firstName &&
    regex.chineseName.test(form.firstName) &&
    form.lastName &&
    regex.chineseName.test(form.lastName) &&
    form.verifiedHospitalName &&
    isHCOValid() &&
    isSpecialtyValid() &&
    form.verifiedSpecialty &&
    form.email &&
    regex.email.test(form.email) &&
    form.mobile &&
    regex.mobile.test(form.mobile) &&
    form.verificationCode &&
    form.verificationCode === state.value.verificationCodeForChecking &&
    form.agreement.length > 0
  )

// ! 測試使用
// console.table({
//   hcpRole: form.hcpRole,
//   firstName: form.firstName,
//   firstName_valid: regex.chineseName.test(form.firstName),
//   lastName: form.lastName,
//   lastName_valid: regex.chineseName.test(form.lastName),
//   verifiedHospitalName: form.verifiedHospitalName,
//   HCO_valid: isHCOValid(),
//   verifiedSpecialty: form.verifiedSpecialty,
//   specialty_valid: isSpecialtyValid(),
//   email: form.email,
//   email_valid: regex.email.test(form.email),
//   mobile: form.mobile,
//   mobile_valid: regex.mobile.test(form.mobile),
//   verificationCode: form.verificationCode,
//   code_match: form.verificationCode === state.value.verificationCodeForChecking,
//   agreement: form.agreement.length > 0,
//   sector: form.sector
// })

  const emitData: any = {
    hcpUser: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      mobile: form.mobile,
      hcpRole: form.hcpRole,
      sector: form.sector,
      verifiedSpecialty: form.verifiedSpecialty,
      verifiedHospitalName: form.verifiedHospitalName,
      token: form.token,
      verificationCode: form.verificationCode,
      profileId: route.query.profileId,
      lineId: route.query.lineId,
    }
  }

  if (route.query.mediaSource) {
    emitData.hcpUser.mediaSource = route.query.mediaSource as string
  }

  if (route.query.activitySource) {
    emitData.hcpUser.activitySource = route.query.activitySource as string
  }

  if (route.query.invitedBu) {
    emitData.hcpUser.invitedBu = route.query.invitedBu as string
  }

  if (route.query.invitedSales) {
    emitData.hcpUser.invitedSales = route.query.invitedSales as string
  }

  if (route.query.invitedTeam) {
    emitData.hcpUser.invitedTeam = route.query.invitedTeam as string
  }
  
  // 如果有醫療院所 (不是自己填寫的那種)
  const filteredHCO = state.value.options.HCO.find(hospital => hospital.hcoFullName === form.verifiedHospitalName)
  if (form.sector === 'HP' && filteredHCO) {
    emitData.hcpUser.verifiedHospitalName = filteredHCO.externalID
  }

  // 如果點 科別要轉換成
  const filteredSpecialty = state.value.options.specialty.find(specialty => specialty.specialtyChineseName === form.verifiedSpecialty)
  if (state.value.radio.specialty.status === SpecialtyRadioEnums.CurrentSpecialty && filteredSpecialty) {
    emitData.hcpUser.verifiedSpecialty = filteredSpecialty.code
  }

  emit('isFormComplete', check) // 用來檢測要不要 disabled submit 按鈕
  emit('updateForm', emitData) // 更新表單資料
})

const getMobileToken = (mobileToken: string) => {
  state.value.form.token = mobileToken
}

const getVerificationCode = (verificationCode: string) => {
  state.value.verificationCodeForChecking = verificationCode
}

/*
  * 初始化選項
*/
const init = async () => {
  const { options } = state.value
  const optionApi = await useOptionApi.getAllOptions()
  options.specialty = optionApi.data.specialtyOptions
  options.HCO = optionApi.data.hospitalOptions
  options.role = optionApi.data.roleOptions

  // ! 清空手機驗證碼 避免上一次的驗證碼影響到下一次
  formStorage.value.verificationCode = ''
  state.value.form.verificationCode = ''
}

onMounted(async () => init())  
</script>
<template>
  <div>
    <n-form
      ref="formRef"
      :model="state.form"
      :rules="rules"
      require-mark-placement="right-hanging"
      label-width="auto"
    >
      <n-form-item
        label="醫療人員類別"
        path="hcpRole"
      >
        <n-select
          v-model:value="state.form.hcpRole"
          placeholder="請選擇醫療人員類別"
          :options="medicalPersonalOptions"
          @blur="debouncedHandleNameChange"
        />
      </n-form-item>
      <n-flex>
        <n-form-item
          label="姓(中文)"
          path="lastName"
          style="width: calc(50% - 6px)"
        >
          <n-input
            v-model:value="state.form.lastName"
            placeholder="請輸入您的中文姓"
            @blur="debouncedHandleNameChange"
          />
        </n-form-item>
        <n-form-item
          label="名(中文)"
          path="firstName"
          style="width: calc(50% - 6px)"
        >
          <n-input
            v-model:value="state.form.firstName"
            placeholder="請輸入您的中文名"
            @blur="debouncedHandleNameChange"
          />
        </n-form-item>
      </n-flex>
      <n-form-item
        label="醫療院所類別"
        path="sector"
      >
        <n-radio-group
          v-model:value="state.form.sector"
          name="sector"
          @update:value="debouncedHandleNameChange"
        >
          <n-radio-button
            v-for="sector in selectOption.sectors"
            :key="sector.value"
            :value="sector.value"
            :label="sector.label"
          />
        </n-radio-group>
      </n-form-item>
      <n-form-item
        label="醫療機構"
        path="verifiedHospitalName"
      >
        <n-space
          vertical
          class="w-100%"
        >
          <n-radio-group
            v-model:value="state.radio.HCO.status"
            name="radiogroup"
            @update:value="debouncedHandleNameChange"
          >
            <n-space>
              <n-radio
                v-for="radio in selectOption.HCO_Radiogroup"
                :key="radio.value"
                :value="radio.value"
                :label="radio.label"
                :disabled="
                  (state.form.sector === 'GP' && radio.value === HCORadioEnums.CurrentHCO)|| 
                    (state.form.sector === 'DS' && radio.value === HCORadioEnums.CurrentHCO)
                "
                @change="state.form.verifiedHospitalName = ''"
              />
            </n-space>
          </n-radio-group>
          <!-- Current -->
          <n-auto-complete
            v-if="state.radio.HCO.status === HCORadioEnums.CurrentHCO"
            v-model:value="state.form.verifiedHospitalName"
            :options="filteredHCOOptions"
            placeholder="請輸入您的醫療機構"
            @blur="debouncedHandleNameChange"
          />
          <!-- Other -->
          <n-input
            v-else
            ref="HCOinput"
            v-model:value="state.form.verifiedHospitalName"
            placeholder="請輸入您的醫療機構"
            @blur="debouncedHandleNameChange"
          />
        </n-space>
      </n-form-item>
      <n-form-item
        label="醫療科別"
        path="verifiedSpecialty"
      >
        <n-space
          vertical
          class="w-100%"
        >
          <n-radio-group
            v-model:value="state.radio.specialty.status"
            name="radiogroup"
            @update:value="debouncedHandleNameChange"
          >
            <n-space>
              <n-radio
                v-for="radio in selectOption.specialty_Radiogroup"
                :key="radio.value"
                :value="radio.value"
                :label="radio.label"
                @change="state.form.verifiedSpecialty = ''"
              />
            </n-space>
          </n-radio-group>
          <n-auto-complete
            v-if="state.radio.specialty.status === SpecialtyRadioEnums.CurrentSpecialty"
            v-model:value="state.form.verifiedSpecialty"
            :options="filteredSpecialtyOptions"
            placeholder="選擇您的醫療科別"
            @blur="debouncedHandleNameChange"
          />
          <n-input
            v-else
            v-model:value="state.form.verifiedSpecialty"
            placeholder="選擇您的醫療科別"
            @blur="debouncedHandleNameChange"
          />
        </n-space>
      </n-form-item>
      <n-form-item
        label="電子信箱"
        path="email"
      >
        <n-auto-complete
          v-model:value="state.form.email"
          :options="autoCompleteEmailOptions"
          placeholder="請輸入您的電子信箱"
          @blur="debouncedHandleNameChange"
        />
      </n-form-item>
      <n-form-item
        label="手機號碼"
        path="mobile"
      >
        <n-input-group>
          <n-input
            v-model:value="state.form.mobile"
            placeholder="請輸入您的手機號碼"
            :show-button="false"
            :allow-input="(value: string) => !value || /^\d+$/.test(value)"
            @blur="debouncedHandleNameChange"
          />
          <NButtonMobileVerification
            :mobile-number="state.form.mobile"
            @mobile-token="getMobileToken"
            @verification-code="getVerificationCode"
          />
        </n-input-group>
      </n-form-item>
      <n-form-item
        label="手機驗證碼"
        path="verificationCode"
      >
        <n-input
          v-model:value="state.form.verificationCode"
          placeholder="請輸入您的手機驗證碼"
          :show-button="false"
          class="w-full"
          @blur="debouncedHandleNameChange"
        />
      </n-form-item>
      <n-form-item
        label="個人資料蒐集告知事項與同意"
        path="agreementGroup"
      >
        <n-checkbox-group
          v-model:value="state.form.agreement"
          @update:value="debouncedHandleNameChange"
        >
          <n-space vertical>
            <n-p>
              {{ terms.agreementUp }}
            </n-p>
            <n-checkbox
              value="agreement1"
              :label="terms.agreement"
            />
            <!-- <n-checkbox
              value="agreement2"
              :label="terms.remind"
            /> -->
          </n-space>
        </n-checkbox-group>
      </n-form-item>
      <n-space justify="end">
        <n-p>C-ANPROM/TW/CORP/0064 JAN2026</n-p>
      </n-space>
    </n-form>
  </div>
</template>
