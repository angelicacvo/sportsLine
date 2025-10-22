import { User, type AuthUserDTO, type RegisterUserDTO } from '../models/users.model.ts'
import { hashPassword, comparePassword } from '../utils/bcrypt.handle.ts'

export async function registerUser(data: RegisterUserDTO) {
  const { name, email, password } = data
  if (!name || !email || !password) throw new Error('name, email and password are required')

  const exists = await User.findOne({ where: { email } })
  if (exists) throw new Error('Email already registered')

  const passwordHash = await hashPassword(password)
  const user = await User.create({ name, email, password: passwordHash })
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function loginUser(data: AuthUserDTO) {
  const { email, password } = data
  if (!email || !password) throw new Error('email and password are required')

  const user = await User.findOne({ where: { email } })
  if (!user) throw new Error('Invalid credentials')

  const ok = await comparePassword(password, user.password)
  if (!ok) throw new Error('Invalid credentials')

  return { id: user.id, name: user.name, email: user.email, role: user.role }
}
