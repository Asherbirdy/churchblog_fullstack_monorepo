import { User } from '@prisma/client'

export const createTokenUser = (user: User) => {
  return {
    name: user.name,
    userId: user.id,
    role: user.role
  }
}
