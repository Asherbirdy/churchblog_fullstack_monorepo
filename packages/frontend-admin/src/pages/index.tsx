import {
  Box, Flex, Text, Heading, Input, Button, VStack, HStack, Icon,
} from '@chakra-ui/react'
import {
  LuChurch, LuMail, LuLock, LuEye, LuEyeOff, LuShieldCheck,
} from 'react-icons/lu'
import { useAuthApi } from '@/api'
import { useAuthStore } from '@/stores'
import { toaster } from '@/components/ui/toaster'
import { cookie } from '@/utils/cookie'
import { CookieEnum, Routes } from '@/enums'
import { config } from '@/config'

export default function LoginPage () {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [email, setEmail] = useState(config.test.email || '')
  const [password, setPassword] = useState(config.test.password || '')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const sendOtpMutation = useMutation({
    mutationFn: useAuthApi.loginSendOtp,
    onSuccess: () => {
      setStep('otp')
      toaster.create({
        title: '驗證碼已寄出',
        description: `驗證碼已寄送至 ${
          email
        }`,
        type: 'success',
      })
    },
    onError: () => {
      toaster.create({
        title: '寄送失敗',
        description: '請確認帳號密碼是否正確',
        type: 'error',
      })
    },
  })

  const loginMutation = useMutation({
    mutationFn: useAuthApi.login,
    onSuccess: (res) => {
      const { token } = res.data
      cookie.set(CookieEnum.AccessToken, token.accessTokenJWT)
      cookie.set(CookieEnum.RefreshToken, token.refreshTokenJWT)
      useAuthStore.getState().setIsAuthenticated(true)
      navigate(Routes.DashboardHome)
    },
    onError: () => {
      toaster.create({
        title: '登入失敗',
        description: '驗證碼錯誤或已過期',
        type: 'error',
      })
    },
  })

  const handleSendOtp = (e?: React.SyntheticEvent) => {
    e?.preventDefault()
    sendOtpMutation.mutate({ email, password })
  }

  const handleLogin = (e: React.SyntheticEvent) => {
    e.preventDefault()
    loginMutation.mutate({
      email, password, otp,
    })
  }

  const handleBackToCredentials = () => {
    setStep('credentials')
    setOtp('')
  }

  return (
    <Flex minH="100vh" bg="#faf8f5">
      {/* Left - Decorative Panel */}
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        w="50%"
        bg="#2d241c"
        position="relative"
        overflow="hidden"
        direction="column"
        justify="space-between"
        p="12"
      >
        {/* Background circles */}
        <Box position="absolute" inset="0" opacity="0.1">
          <Box
            position="absolute"
            top="5rem"
            left="5rem"
            w="16rem"
            h="16rem"
            rounded="full"
            border="1px solid"
            borderColor="#bfab92"
          />
          <Box
            position="absolute"
            bottom="8rem"
            right="4rem"
            w="24rem"
            h="24rem"
            rounded="full"
            border="1px solid"
            borderColor="#bfab92"
          />
          <Box
            position="absolute"
            top="50%"
            left="33%"
            w="12rem"
            h="12rem"
            rounded="full"
            border="1px solid"
            borderColor="#bfab92"
          />
        </Box>

        {/* Top logo */}
        <HStack gap="2.5" position="relative" zIndex="10">
          <Flex
            w="8"
            h="8"
            bg="rgba(255,255,255,0.1)"
            rounded="lg"
            align="center"
            justify="center"
          >
            <Icon as={LuChurch} color="white" fontSize="lg" />
          </Flex>
          <Text
            fontFamily="'Playfair Display', serif"
            fontSize="xl"
            fontWeight="600"
            color="white"
            letterSpacing="-0.025em"
          >
            小羊天地
          </Text>
        </HStack>

        {/* Center quote */}
        <Box position="relative" zIndex="10">
          <Text
            fontFamily="'Playfair Display', serif"
            fontSize="4xl"
            color="white"
            lineHeight="1.4"
            mb="6"
          >
            「你們祈求，就給你們；
            <br />
            尋找，就尋見；
            <br />
            叩門，就給你們開門。」
          </Text>
          <Text color="#bfab92" fontSize="sm">
            馬太福音 7:7
          </Text>
        </Box>

        {/* Bottom copyright */}
        <Box position="relative" zIndex="10">
          <Text color="#a8916f" fontSize="sm">
            &copy;
            {' '}
            {new Date().getFullYear()}
            {' '}
            小羊天地
          </Text>
        </Box>
      </Flex>

      {/* Right - Login Form */}
      <Flex
        flex="1"
        align="center"
        justify="center"
        px="6"
        py="12"
      >
        <Box
          w="full"
          maxW="24rem"
          animation="fadeIn 0.6s ease-out"
        >
          {/* Mobile logo */}
          <HStack
            display={{ base: 'flex', lg: 'none' }}
            gap="2.5"
            mb="10"
          >
            <Flex
              w="8"
              h="8"
              bg="#2d241c"
              rounded="lg"
              align="center"
              justify="center"
            >
              <Icon as={LuChurch} color="white" fontSize="lg" />
            </Flex>
            <Text
              fontFamily="'Playfair Display', serif"
              fontSize="xl"
              fontWeight="600"
              color="#2d241c"
              letterSpacing="-0.025em"
            >
              小羊天地
            </Text>
          </HStack>

          {step === 'credentials' && (
            <>
              {/* Heading */}
              <Box mb="8">
                <Heading
                  fontFamily="'Playfair Display', serif"
                  fontSize="3xl"
                  fontWeight="700"
                  color="#2d241c"
                  mb="2"
                >
                  歡迎回來
                </Heading>
                <Text color="#a8916f" fontSize="sm">
                  登入你的帳號以繼續
                </Text>
              </Box>

              {/* Credentials Form */}
              <form onSubmit={handleSendOtp}>
                <VStack gap="5" align="stretch">
                  {/* Email */}
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="#7a664a"
                      mb="1.5"
                    >
                      電子信箱
                    </Text>
                    <Box position="relative">
                      <Box
                        position="absolute"
                        left="0.875rem"
                        top="50%"
                        transform="translateY(-50%)"
                        color="#bfab92"
                        zIndex="1"
                        pointerEvents="none"
                      >
                        <Icon as={LuMail} />
                      </Box>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        pl="2.5rem"
                        py="5"
                        rounded="xl"
                        border="1px solid"
                        borderColor="#e8e0d4"
                        bg="white"
                        color="#2d241c"
                        fontSize="0.9375rem"
                        _placeholder={{ color: '#bfab92' }}
                        _focus={{
                          borderColor: '#a8916f',
                          boxShadow: '0 0 0 3px rgba(168,145,111,0.15)',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Password */}
                  <Box>
                    <Flex justify="space-between" align="center" mb="1.5">
                      <Text fontSize="sm" fontWeight="500" color="#7a664a">
                        密碼
                      </Text>
                      <Button
                        variant="plain"
                        fontSize="xs"
                        color="#425f40"
                        fontWeight="normal"
                        p="0"
                        h="auto"
                        minW="auto"
                        _hover={{ color: '#364c34' }}
                      >
                        忘記密碼？
                      </Button>
                    </Flex>
                    <Box position="relative">
                      <Box
                        position="absolute"
                        left="0.875rem"
                        top="50%"
                        transform="translateY(-50%)"
                        color="#bfab92"
                        zIndex="1"
                        pointerEvents="none"
                      >
                        <Icon as={LuLock} />
                      </Box>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="請輸入密碼"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        pl="2.5rem"
                        pr="2.5rem"
                        py="5"
                        rounded="xl"
                        border="1px solid"
                        borderColor="#e8e0d4"
                        bg="white"
                        color="#2d241c"
                        fontSize="0.9375rem"
                        _placeholder={{ color: '#bfab92' }}
                        _focus={{
                          borderColor: '#a8916f',
                          boxShadow: '0 0 0 3px rgba(168,145,111,0.15)',
                        }}
                      />
                      <Button
                        variant="plain"
                        position="absolute"
                        right="0.5rem"
                        top="50%"
                        transform="translateY(-50%)"
                        minW="auto"
                        h="auto"
                        p="1"
                        color="#bfab92"
                        _hover={{ color: '#7a664a' }}
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        zIndex="1"
                      >
                        <Icon as={showPassword ? LuEyeOff : LuEye} />
                      </Button>
                    </Box>
                  </Box>

                  {/* Submit */}
                  <Button
                    type="submit"
                    w="full"
                    py="5"
                    rounded="xl"
                    bg="#2d241c"
                    color="white"
                    fontSize="0.9375rem"
                    fontWeight="600"
                    mt="2"
                    loading={sendOtpMutation.isPending}
                    _hover={{ bg: '#544638' }}
                  >
                    取得驗證碼
                  </Button>
                </VStack>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              {/* Heading */}
              <Box mb="8">
                <Heading
                  fontFamily="'Playfair Display', serif"
                  fontSize="3xl"
                  fontWeight="700"
                  color="#2d241c"
                  mb="2"
                >
                  輸入驗證碼
                </Heading>
                <Text color="#a8916f" fontSize="sm">
                  驗證碼已寄送至
                  {' '}
                  {email}
                </Text>
              </Box>

              {/* OTP Form */}
              <form onSubmit={handleLogin}>
                <VStack gap="5" align="stretch">
                  {/* OTP */}
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="#7a664a"
                      mb="1.5"
                    >
                      驗證碼 (OTP)
                    </Text>
                    <Box position="relative">
                      <Box
                        position="absolute"
                        left="0.875rem"
                        top="50%"
                        transform="translateY(-50%)"
                        color="#bfab92"
                        zIndex="1"
                        pointerEvents="none"
                      >
                        <Icon as={LuShieldCheck} />
                      </Box>
                      <Input
                        type="text"
                        placeholder="請輸入驗證碼"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        pl="2.5rem"
                        py="5"
                        rounded="xl"
                        border="1px solid"
                        borderColor="#e8e0d4"
                        bg="white"
                        color="#2d241c"
                        fontSize="0.9375rem"
                        _placeholder={{ color: '#bfab92' }}
                        _focus={{
                          borderColor: '#a8916f',
                          boxShadow: '0 0 0 3px rgba(168,145,111,0.15)',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Submit */}
                  <Button
                    type="submit"
                    w="full"
                    py="5"
                    rounded="xl"
                    bg="#2d241c"
                    color="white"
                    fontSize="0.9375rem"
                    fontWeight="600"
                    mt="2"
                    loading={loginMutation.isPending}
                    _hover={{ bg: '#544638' }}
                  >
                    登入
                  </Button>

                  {/* Back */}
                  <Button
                    variant="plain"
                    w="full"
                    fontSize="sm"
                    color="#a8916f"
                    fontWeight="normal"
                    _hover={{ color: '#7a664a' }}
                    onClick={handleBackToCredentials}
                    type="button"
                  >
                    返回重新輸入帳號密碼
                  </Button>

                  {/* Resend */}
                  <Button
                    variant="plain"
                    w="full"
                    fontSize="sm"
                    color="#425f40"
                    fontWeight="normal"
                    _hover={{ color: '#364c34' }}
                    onClick={handleSendOtp}
                    type="button"
                  >
                    重新寄送驗證碼
                  </Button>
                </VStack>
              </form>
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}
