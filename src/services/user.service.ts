import { User, type UserRole } from '../models/users.model.ts'
import { hashPassword } from '../utils/bcrypt.handle.ts'

// get a paginated list of users
export async function getUsersService() {
  return User.findAll()
}

// get a single user by id and return a safe subset
export async function getUserByIdService(id: number) {
  const user = await User.findByPk(id)
  if (!user) return 'User not found'
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

// create a new user with hashed password and optional role
export async function createUserService(data: { name: string; email: string; password: string; role?: UserRole }) {
  const { name, email, password, role } = data
  if (!name || !email || !password) return 'name, email and password are required'
  const exists = await User.findOne({ where: { email } })
  if (exists) return 'Email already registered'
  const passwordHash = await hashPassword(password)
  const user = await User.create({ name, email, password: passwordHash, role: role ?? 'seller' })
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

// update user fields and hash password when provided
export async function updateUserService(
  id: number,
  data: { name?: string; email?: string; password?: string; role?: UserRole }
) {
  const user = await User.findByPk(id)
  if (!user) return 'User not found'

  if (data.email && data.email !== user.email) {
    const exists = await User.findOne({ where: { email: data.email } })
    if (exists) return 'Email already registered'
  }

  if (data.name !== undefined) user.name = data.name
  if (data.email !== undefined) user.email = data.email
  if (data.role !== undefined) user.role = data.role
  if (data.password) user.password = await hashPassword(data.password)

  await user.save()
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function deleteUserService(id: number) {
  const user = await User.findByPk(id)
  if (!user) return 'User not found'
  await user.destroy()
  return true
}
