import type { NavigateFunction } from 'react-router-dom'
import { create } from 'zustand'
import { cookie } from '@/utils/cookie'
import {
  CookieEnum, Routes, Routes_Admin,
} from '@/enums'
import { useUserApi } from '@/api'
import type { UserShowMe } from '@/api/useUserApi'

interface AuthStore {
  isLogin: boolean
  isInitialized: boolean
  user: UserShowMe | null
  setIsAuthenticated: (value: boolean) => void
  checkLogin: (navigate: NavigateFunction) => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  isInitialized: false,
  user: null,

  // 設定認證狀態
  setIsAuthenticated: (value: boolean) => set({ isLogin: value }),

  // 檢查登入狀態
  checkLogin: async (navigate) => {
    const refreshToken = cookie.get(CookieEnum.RefreshToken)

    if (!refreshToken) {
      set({
        isLogin: false, isInitialized: true, user: null,
      })
      navigate('/')
      return
    }

    try {
      const response = await useUserApi.showCurrentUser()
      set({
        isLogin: true,
        isInitialized: true,
        user: response.data.user,
      })
      navigate(Routes_Admin.Home)
    }
    catch {
      set({
        isLogin: false,
        isInitialized: true,
        user: null,
      })
      navigate(Routes.PublicHome)
    }
  },
}))

// 導出 getter 函數,可以在非 React 環境中使用
export const getIsLogin = () => useAuthStore.getState().isLogin
export const getIsInitialized = () => useAuthStore.getState().isInitialized
