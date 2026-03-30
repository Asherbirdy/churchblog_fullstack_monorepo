import { Outlet, useNavigate } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { Spinner, Center } from '@chakra-ui/react'
import { useAuthStore } from '@/stores'

export function App () {
  const checkLogin = useAuthStore((state) => state.checkLogin)
  const navigate = useNavigate()

  // App 初始化時檢查登入狀態
  useEffect(() => {
    checkLogin(navigate)
  }, [checkLogin, navigate])

  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      <Outlet />
    </Suspense>
  )
}