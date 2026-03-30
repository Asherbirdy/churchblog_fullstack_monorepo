import {
  Box, Heading, Text, VStack, HStack, Icon, Flex,
} from '@chakra-ui/react'
import {
  LuUser, LuMail, LuShield,
} from 'react-icons/lu'
import { useAuthStore } from '@/stores'

export default function AdminPage () {
  const user = useAuthStore((state) => state.user)

  return (
    <Box>
      <Heading
        fontFamily="'Playfair Display', serif"
        fontSize="2xl"
        fontWeight="700"
        color="#2d241c"
        mb="6"
      >
        儀表板
      </Heading>

      {user && (
        <Box
          bg="white"
          border="1px solid"
          borderColor="#e8e0d4"
          rounded="2xl"
          p="6"
          maxW="28rem"
        >
          <Text
            fontSize="sm"
            color="#a8916f"
            mb="4"
            fontWeight="500"
          >
            目前登入帳號
          </Text>
          <VStack gap="3" align="stretch">
            <HStack gap="3">
              <Flex
                w="8"
                h="8"
                bg="#faf8f5"
                rounded="lg"
                align="center"
                justify="center"
              >
                <Icon as={LuUser} color="#7a664a" />
              </Flex>
              <Box>
                <Text fontSize="xs" color="#a8916f">名稱</Text>
                <Text fontSize="sm" color="#2d241c" fontWeight="500">{user.name}</Text>
              </Box>
            </HStack>
            <HStack gap="3">
              <Flex
                w="8"
                h="8"
                bg="#faf8f5"
                rounded="lg"
                align="center"
                justify="center"
              >
                <Icon as={LuMail} color="#7a664a" />
              </Flex>
              <Box>
                <Text fontSize="xs" color="#a8916f">電子信箱</Text>
                <Text fontSize="sm" color="#2d241c" fontWeight="500">{user.email}</Text>
              </Box>
            </HStack>
            <HStack gap="3">
              <Flex
                w="8"
                h="8"
                bg="#faf8f5"
                rounded="lg"
                align="center"
                justify="center"
              >
                <Icon as={LuShield} color="#7a664a" />
              </Flex>
              <Box>
                <Text fontSize="xs" color="#a8916f">角色</Text>
                <Text fontSize="sm" color="#2d241c" fontWeight="500">{user.role}</Text>
              </Box>
            </HStack>
          </VStack>
        </Box>
      )}
    </Box>
  )
}
