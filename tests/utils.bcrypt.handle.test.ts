import { hashPassword, comparePassword } from '../src/utils/bcrypt.handle.ts'

describe('utils/bcrypt.handle', () => {
  test('hash and compare success', async () => {
    const plain = 'Secret123$'
    const hash = await hashPassword(plain)
    expect(hash).toBeTruthy()
    const ok = await comparePassword(plain, hash)
    expect(ok).toBe(true)
  })

  test('compare fails with wrong password', async () => {
    const plain = 'Secret123$'
    const hash = await hashPassword(plain)
    const ok = await comparePassword('wrong', hash)
    expect(ok).toBe(false)
  })
})
