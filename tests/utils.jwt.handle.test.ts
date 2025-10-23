import { jest } from '@jest/globals'
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../src/utils/jwt.handle.ts'

describe('utils/jwt.handle', () => {
  const payload = { id: 1, email: 'a@b.com', role: 'seller' as const }

  test('sign and verify access token', () => {
    const token = signAccessToken(payload)
    const decoded = verifyAccessToken(token)
    expect(decoded.id).toBe(payload.id)
    expect(decoded.email).toBe(payload.email)
    expect(decoded.role).toBe(payload.role)
  })

  test('sign and verify refresh token', () => {
    const token = signRefreshToken(payload)
    const decoded = verifyRefreshToken(token)
    expect(decoded.id).toBe(payload.id)
    expect(decoded.email).toBe(payload.email)
    expect(decoded.role).toBe(payload.role)
  })

  test('verifyAccessToken throws for invalid token', () => {
    expect(() => verifyAccessToken('invalid.token')).toThrow()
  })
})
