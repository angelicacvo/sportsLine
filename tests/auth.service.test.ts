import { jest } from '@jest/globals'
import { registrationService, loginService } from '../src/services/auth.service.ts'
import { User } from '../src/models/users.model.ts'
// Note: Avoid mocking ESM named exports (read-only). We focus on registration path here.

describe('auth.service', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('registrationService returns error when email exists', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ id: 1 } as any)
    const res = await registrationService({ name: 'A', email: 'a@a.com', password: 'x' })
    expect(res).toBe('Email already registered')
  })

  test('registrationService returns error on missing fields', async () => {
    const res = await registrationService({ name: '', email: '', password: '' } as any)
    expect(res).toBe('name, email and password are required')
  })

  test('loginService returns error on missing fields', async () => {
    const res = await loginService({ email: '', password: '' } as any)
    expect(res).toBe('email and password are required')
  })

  // Additional login tests skipped to avoid ESM export mutation issues in this environment.
})
