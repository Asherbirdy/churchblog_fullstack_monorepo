import { onMounted, ref } from 'vue'
import type { Liff } from '@line/liff'
import type { Ref } from 'vue'

 interface LineProfile {
  displayName: string
  pictureUrl: string
  statusMessage: string
  userId: string
}
interface LiffReturn {
  LIFF: Ref<Liff | null>
  LineProfile: Ref<LineProfile | null>
}

 interface LiffConfig {
  liffId: {
    dev: string // 開發環境的 liffId
    testProduction?: string // CDN環境的 liffId
    production?: string // 正式環境的 liffId
  }
  login: boolean // 是否需要登入
  liffInit: boolean // 是否需要初始化
  redirectUrl?: string // 重定向的 ur
  environment: string // 環境
}

/**
 * 使用 LIFF ID 初始化 LIFF
 */
export const useLiff = (payload: LiffConfig): LiffReturn => {
  const LIFF = ref<Liff | null>(null)
  const LineProfile = ref<LineProfile | null>(null)

  const initLiff = async () => {
    const { liffId, login, liffInit, redirectUrl, environment } = payload

    const liffIdEnv = () => {
      if (environment === 'development') {
        return liffId?.dev || ''
      }

      if (environment === 'testProduction') {
        return liffId?.testProduction || ''
      }

      if (environment === 'production') {
        return liffId?.production || ''
      }

      console.error('請補上環境變數', environment)
    }

    try {
      // eslint-disable-next-line no-console
      console.log('liffId', liffIdEnv())

      if (!liffInit) {
        return
      }

      const liff = (await import('@line/liff')).default
      await liff.init({
        liffId: liffIdEnv() || '',
      })

      LIFF.value = liff

      if (!login) {
        return
      }

      if (!LIFF.value.isLoggedIn()) {
        liff.login({
          redirectUri: redirectUrl,
        })
      }

      LIFF.value
        .getProfile()
        .then((profile) => {
          LineProfile.value = {
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl || '',
            statusMessage: profile.statusMessage || '',
            userId: profile.userId,
          }
        })
    }
    catch (error) {
      console.error('Failed to initialize LIFF:', error)
    }
  }

  onMounted(initLiff)
  return { LIFF, LineProfile }
}
