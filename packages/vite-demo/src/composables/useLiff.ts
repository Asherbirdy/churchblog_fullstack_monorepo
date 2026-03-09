import type { Liff } from '@line/liff'
import type { Ref } from 'vue'

export type Status = 'signin' | 'inited'

interface LiffReturn {
  LIFF: Ref<Liff | null>
  ProfileUserId: Ref<string>
}

export const useLiff = (): LiffReturn => {
  const LIFF = ref<Liff | null>(null)
  const ProfileUserId = ref('')

  const initLiff = async () => {
    try {
      const liff = (await import('@line/liff')).default

      await liff.init({
        liffId: import.meta.env.VITE_LIFF_ID
      })

      LIFF.value = liff

      // // 如果沒登入請登入
      // if (!LIFF.value.isLoggedIn()) {
      //   liff.login()
      //   return
      // }

      // 有登入過 取得 userId
      LIFF.value
        .getProfile()
        .then(profile => {
          ProfileUserId.value = profile.userId
        })

    } catch (err) {
      console.error('LIFF initialization failed', err)
      return
    }
  }

  onMounted(initLiff)

  return {
    LIFF,
    ProfileUserId
  }
}
