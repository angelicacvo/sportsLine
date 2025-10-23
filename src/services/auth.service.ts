// authentication services for registration and login
// returns safe user objects and tokens, or error strings on failure
import { User, type AuthUserDTO, type RegisterUserDTO } from '../models/users.model.ts'
import { hashPassword, comparePassword } from '../utils/bcrypt.handle.ts'
import { signAccessToken } from '../utils/jwt.handle.ts'

// registration service: creates user and returns safe object or error string
export async function registrationService(data: RegisterUserDTO) {
  const { name, email, password } = data
  if (!name || !email || !password) return 'name, email and password are required'

  const exists = await User.findOne({ where: { email } })
  if (exists) return 'Email already registered'

  const passwordHash = await hashPassword(password)
  const user = await User.create({ name, email, password: passwordHash })
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

// login service: validates credentials and returns { token, user } or error string
export async function loginService(data: AuthUserDTO) {
  const { email, password } = data
  if (!email || !password) return 'email and password are required'

  const user = await User.findOne({ where: { email } })
  if (!user) return 'Invalid credentials'

  const ok = await comparePassword(password, user.password)
  if (!ok) return 'Invalid credentials'

  const token = signAccessToken({ id: user.id, email: user.email, role: user.role })
  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role }
  return { token, user: safeUser }
}
