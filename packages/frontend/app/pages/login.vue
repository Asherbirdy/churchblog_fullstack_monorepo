<script setup lang="ts">
definePageMeta({
  layout: false
})

useHead({
  title: '登入 — 小羊天地'
})

const state = ref({
  data: {
    form: {
      email: '',
      password: ''
    }
  },
  feature: {
    showPassword: false,
    isLoading: false
  }
})

const handleLogin = async () => {
  state.value.feature.isLoading = true
  try {
    // TODO: call login API
  } finally {
    state.value.feature.isLoading = false
  }
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

    <!-- Right - Login Form -->
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

        <!-- Heading -->
        <div class="mb-8">
          <h1 class="font-display text-3xl font-bold text-sand-950 mb-2">
            歡迎回來
          </h1>
          <p class="text-sand-500 text-sm">
            登入你的帳號以繼續
          </p>
        </div>

        <!-- Form -->
        <form
          class="space-y-5"
          @submit.prevent="handleLogin"
        >
          <!-- Email -->
          <div class="space-y-1.5">
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

          <!-- Password -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-sand-700">
                密碼
              </label>
              <NuxtLink
                to="/forgot-password"
                class="text-xs text-sage-600 hover:text-sage-700 transition-colors"
              >
                忘記密碼？
              </NuxtLink>
            </div>
            <UInput
              v-model="state.data.form.password"
              :type="state.feature.showPassword ? 'text' : 'password'"
              placeholder="請輸入密碼"
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

          <!-- Submit -->
          <UButton
            type="submit"
            label="登入"
            size="lg"
            block
            :loading="state.feature.isLoading"
            class="rounded-xl bg-sand-950 text-white hover:bg-sand-800 mt-2"
          />
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-sand-200" />
          <span class="text-xs text-sand-400">或</span>
          <div class="flex-1 h-px bg-sand-200" />
        </div>

        <!-- Register link -->
        <p class="text-center text-sm text-sand-500">
          還沒有帳號？
          <NuxtLink
            to="/register"
            class="text-sage-600 font-medium hover:text-sage-700 transition-colors"
          >
            立即註冊
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
