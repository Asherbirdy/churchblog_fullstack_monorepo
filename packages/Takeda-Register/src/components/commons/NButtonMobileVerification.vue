<script setup lang='ts'>
/* 在父層 組件 加上 mobileToken 來取得 簡訊API 回傳的 Token (參考 emit 變數)
  例如：
  <NButtonMobileVerification @mobileToken="getMobileToken" />
  函式:
  const getMobileToken = (mobileToken: string) => { }
*/
import { useIntervalFn, useStorage } from '@vueuse/core'
import { NButton } from 'naive-ui'

import { useAuthApi } from '@/hooks'
import { regex } from '@/utils'

/*
  props 進來電話號碼
*/
interface PropsState {
  mobileNumber: string | null
}

const props = defineProps<PropsState>()
const emit = defineEmits(['mobileToken', 'verificationCode'])
const { mobileNumber } = toRefs(props)

// 設定倒數時間
const sec = 60

const state = ref({
  countDown: 0,
  mobileToken: '',
  verificationCode: ''
})

// 在localStorage的倒數器
const countdownInLocalStorage = useStorage('mobileVerificationCountdown', 0)

const { pause, resume } = useIntervalFn(() => {
  if (countdownInLocalStorage.value <= 0) {
    pause()
    return
  }
  countdownInLocalStorage.value--
}, 1000, { immediate: false })

const sendMobileVerification = async (sec: number) => {
  state.value.countDown = sec
  countdownInLocalStorage.value = sec
  resume()
  if (mobileNumber.value) {
    const response = await useAuthApi.sendVerificationCode(
      { mobile: mobileNumber.value }
    )
    state.value.mobileToken = response.data.token
    state.value.verificationCode = response.data.verificationCode
    emit('mobileToken', state.value.mobileToken)
    emit('verificationCode', state.value.verificationCode)
  }
}

// 恢復簡訊倒數器 在onMounted使用
const restoreCounter = () => {
  if (countdownInLocalStorage.value > 0) {
    state.value.countDown = countdownInLocalStorage.value
    resume()
  }
}

// 檢查 傳送簡訊驗證是否要 Disabled
const isMobileVerificationButtonDisabled = computed(() => {
  const mobile = mobileNumber?.value || ''
  return state.value.countDown > 0 || !regex.mobile.test(mobile)
})

// 監測 倒數按鈕是否要 disabled
watch(countdownInLocalStorage, (newVal) => {
  state.value.countDown = newVal
})

// 恢復倒數
onMounted(() => restoreCounter())
</script>

<template>
  <n-button
    type="info"
    ghost
    :disabled="isMobileVerificationButtonDisabled"
    @click="sendMobileVerification(sec)"
  >
    {{
      state.countDown > 0
        ? `${state.countDown} 秒`
        : '傳送驗證碼'
    }}
  </n-button>
</template>
