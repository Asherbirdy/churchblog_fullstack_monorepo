import { Outlet } from 'react-router-dom'
import {
  Box, Flex, VStack, Icon, Text, HStack,
} from '@chakra-ui/react'
import { LuChurch, LuLayoutDashboard } from 'react-icons/lu'
import { Routes_Admin } from '@/enums'

interface NavItem {
  label: string
  icon: React.ElementType
  path: string
}

const navItems: NavItem[] = [
  {
    label: '儀表板', icon: LuLayoutDashboard, path: Routes_Admin.Home,
  },
]

export default function AdminLayout () {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <Flex minH="100vh" bg="#faf8f5">
      {/* Sidebar */}
      <Box
        as="aside"
        w="16rem"
        bg="#2d241c"
        color="white"
        py="6"
        display={{ base: 'none', lg: 'block' }}
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        overflowY="auto"
      >
        {/* Logo */}
        <HStack gap="2.5" px="6" mb="8">
          <Flex
            w="8"
            h="8"
            bg="rgba(255,255,255,0.1)"
            rounded="lg"
            align="center"
            justify="center"
          >
            <Icon as={LuChurch} fontSize="lg" />
          </Flex>
          <Text
            fontFamily="'Playfair Display', serif"
            fontSize="xl"
            fontWeight="600"
            letterSpacing="-0.025em"
          >
            小羊天地
          </Text>
        </HStack>

        {/* Navigation */}
        <VStack gap="1" align="stretch" px="3">
          {navItems.map((item) => (
            <Flex
              key={item.path}
              align="center"
              gap="3"
              px="3"
              py="2.5"
              rounded="lg"
              cursor="pointer"
              bg={isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent'}
              _hover={{ bg: 'rgba(255,255,255,0.08)' }}
              onClick={() => navigate(item.path)}
            >
              <Icon as={item.icon} fontSize="lg" opacity={isActive(item.path) ? 1 : 0.7} />
              <Text fontSize="sm" fontWeight={isActive(item.path) ? '600' : '400'} opacity={isActive(item.path) ? 1 : 0.7}>
                {item.label}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Main Content */}
      <Box
        flex="1"
        ml={{ base: '0', lg: '16rem' }}
        p="8"
      >
        <Outlet />
      </Box>
    </Flex>
  )
}
