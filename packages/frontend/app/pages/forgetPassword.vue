<script setup lang="ts">
import { useAuthApi } from '~/api'

definePageMeta({
  layout: false,
  middleware: ['guest']
})

useHead({
  title: '忘記密碼 — 小羊天地'
})

const toast = useToast()
const state = ref({
  data: {
    form: {
      email: '',
      otp: '',
      newPassword: ''
    }
  },
  feature: {
    step: 'email' as 'email' | 'otp',
    showPassword: false
  }
})

const {
  execute: SendOtpRequest,
  error: SendOtpError,
  status: SendOtpStatus
} = await useAuthApi.forgetPasswordEmailOTP(state.value.data.form)

const {
  execute: ChangePasswordRequest,
  error: ChangePasswordError,
  status: ChangePasswordStatus
} = await useAuthApi.forgetPasswordChangePassword(state.value.data.form)

const handleSendOtp = async () => {
  await SendOtpRequest()

  if (SendOtpError.value) {
    toast.add({
      title: '找不到此信箱的帳號',
      color: 'error'
    })
    return
  }

  state.value.feature.step = 'otp'
  toast.add({
    title: '驗證碼已寄出，請查看信箱',
    color: 'success'
  })
}

const handleChangePassword = async () => {
  await ChangePasswordRequest()

  if (ChangePasswordError.value) {
    toast.add({
      title: '驗證碼錯誤或已過期',
      color: 'error'
    })
    state.value.data.form.otp = ''
    return
  }

  toast.add({
    title: '密碼已成功變更，請重新登入',
    color: 'success'
  })
  navigateTo('/login')
}

const handleBackToEmail = () => {
  state.value.feature.step = 'email'
  state.value.data.form.otp = ''
  state.value.data.form.newPassword = ''
}
</script>

<template>
  <div class="min-h-screen flex bg-sand-50">
    <!-- Left - Decorative Panel -->
    <div class="hidden lg:flex lg:w-1/2 bg-sand-950 relative overflow-hidden flex-col justify-between p-12">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-64 h-64 rounded-full border border-sand-400" />
        <div class="absolute bottom-32 right-16 w-96 h-96 rounded-full border border-sand-400" />
        <div class="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border border-sand-400" />
      </div>

      <!-- Top logo -->
      <div class="relative z-10 flex items-center gap-2.5">
        <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
          <UIcon
            name="i-lucide-church"
            class="text-white text-lg"
          />
        </div>
        <span class="font-display text-xl font-semibold text-white tracking-tight">小羊天地</span>
      </div>

      <!-- Center quote -->
      <div class="relative z-10">
        <p class="font-display text-4xl text-white leading-snug mb-6">
          「你們祈求，就給你們；<br>
          尋找，就尋見；<br>
          叩門，就給你們開門。」
        </p>
        <p class="text-sand-400 text-sm">
          馬太福音 7:7
        </p>
      </div>

      <!-- Bottom spacer -->
      <div class="relative z-10">
        <p class="text-sand-500 text-sm">
          &copy; {{ new Date().getFullYear() }} 小羊天地
        </p>
      </div>
    </div>

    <!-- Right - Form -->
    <div class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-sm animate-fade-up">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center gap-2.5 mb-10">
          <div class="w-8 h-8 bg-sand-950 rounded-lg flex items-center justify-center">
            <UIcon
              name="i-lucide-church"
              class="text-white text-lg"
            />
          </div>
          <span class="font-display text-xl font-semibold text-sand-950 tracking-tight">小羊天地</span>
        </div>

        <!-- Step 1: Email -->
        <template v-if="state.feature.step === 'email'">
          <div class="mb-8">
            <h1 class="font-display text-3xl font-bold text-sand-950 mb-2">
              忘記密碼
            </h1>
            <p class="text-sand-500 text-sm">
              輸入你的電子信箱，我們將寄送驗證碼
            </p>
          </div>

          <form
            class="space-y-5"
            @submit.prevent="handleSendOtp"
          >
            <div class="flex flex-col space-y-1.5">
              <label class="text-sm font-medium text-sand-700">
                電子信箱
              </label>
              <UInput
                v-model="state.data.form.email"
                type="email"
                placeholder="you@example.com"
                icon="i-lucide-mail"
                size="lg"
                required
                :ui="{ base: 'rounded-xl' }"
              />
            </div>

            <UButton
              type="submit"
              label="寄送驗證碼"
              size="lg"
              block
              :loading="SendOtpStatus === 'pending'"
              class="rounded-xl bg-sand-950 text-white hover:bg-sand-800 mt-2"
            />
          </form>

          <NuxtLink
            to="/login"
            class="block w-full text-center text-sm text-sand-500 hover:text-sand-700 transition-colors mt-5"
          >
            返回登入
          </NuxtLink>
        </template>

        <!-- Step 2: OTP + New Password -->
        <template v-if="state.feature.step === 'otp'">
          <div class="mb-8">
            <h1 class="font-display text-3xl font-bold text-sand-950 mb-2">
              重設密碼
            </h1>
            <p class="text-sand-500 text-sm">
              驗證碼已寄送至 {{ state.data.form.email }}
            </p>
          </div>

          <form
            class="space-y-5"
            @submit.prevent="handleChangePassword"
          >
            <div class="flex flex-col space-y-1.5">
              <label class="text-sm font-medium text-sand-700">
                驗證碼 (OTP)
              </label>
              <UInput
                v-model="state.data.form.otp"
                type="text"
                placeholder="請輸入驗證碼"
                icon="i-lucide-shield-check"
                size="lg"
                required
                :ui="{ base: 'rounded-xl' }"
              />
            </div>

            <div class="flex flex-col space-y-1.5">
              <label class="text-sm font-medium text-sand-700">
                新密碼
              </label>
              <UInput
                v-model="state.data.form.newPassword"
                :type="state.feature.showPassword ? 'text' : 'password'"
                placeholder="請輸入新密碼"
                icon="i-lucide-lock"
                size="lg"
                required
                :ui="{ base: 'rounded-xl' }"
              >
                <template #trailing>
                  <UIcon
                    :name="state.feature.showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    class="text-sand-400 cursor-pointer hover:text-sand-600 transition-colors"
                    @click="state.feature.showPassword = !state.feature.showPassword"
                  />
                </template>
              </UInput>
            </div>

            <UButton
              type="submit"
              label="重設密碼"
              size="lg"
              block
              :loading="ChangePasswordStatus === 'pending'"
              class="rounded-xl bg-sand-950 text-white hover:bg-sand-800 mt-2"
            />

            <button
              type="button"
              class="w-full text-center text-sm text-sand-500 hover:text-sand-700 transition-colors"
              @click="handleBackToEmail"
            >
              返回重新輸入信箱
            </button>

            <button
              type="button"
              class="w-full text-center text-sm text-sage-600 hover:text-sage-700 transition-colors"
              @click="handleSendOtp"
            >
              重新寄送驗證碼
            </button>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>
