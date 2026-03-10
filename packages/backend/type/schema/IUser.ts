export interface IUser {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
}
