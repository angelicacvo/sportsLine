import { User } from '../models/users.model.ts'

export async function getUsersService() {
  return User.findAll({ limit: 100 })
}
