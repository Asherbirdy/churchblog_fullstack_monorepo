import { create } from 'zustand'
import { cookie } from '@/utils/cookie'
import { CookieEnum } from '@/enums'
import { useUserApi } from '@/api'
import type { UserShowMe } from '@/api/useUserApi'

interface AuthStore {
  isLogin: boolean
  isInitialized: boolean
  user: UserShowMe | null
  setIsAuthenticated: (value: boolean) => void
  checkLogin: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  isInitialized: false,
  user: null,

  // 設定認證狀態
  setIsAuthenticated: (value: boolean) => set({ isLogin: value }),

  // 檢查登入狀態
  checkLogin: async () => {
    const refreshToken = cookie.get(CookieEnum.RefreshToken)

    if (!refreshToken) {
      set({
        isLogin: false, isInitialized: true, user: null,
      })
      return
    }

    try {
      const response = await useUserApi.showCurrentUser()
      set({
        isLogin: true, isInitialized: true, user: response.data.user,
      })
    } catch {
      set({
        isLogin: false, isInitialized: true, user: null,
      })
    }
  },
}))

// 導出 getter 函數,可以在非 React 環境中使用
export const getIsLogin = () => useAuthStore.getState().isLogin
export const getIsInitialized = () => useAuthStore.getState().isInitialized
