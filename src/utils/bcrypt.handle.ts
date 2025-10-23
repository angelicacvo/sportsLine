import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

// hash a plaintext password
export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

// compare a plaintext password against a hash
export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}
