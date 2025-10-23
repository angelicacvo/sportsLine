import { jest } from '@jest/globals'
import { authMiddleware, roleMiddleware } from '../src/middlewares/auth.middleware.ts'

const mkRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const mkNext = () => jest.fn()

describe('auth.middleware', () => {
  test('authMiddleware returns 401 on missing token', () => {
    const req: any = { headers: {} }
    const res = mkRes()
    const next = mkNext()
    authMiddleware(req, res as any, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('roleMiddleware returns 401 when user missing', () => {
    const mw = roleMiddleware('admin')
    const req: any = {}
    const res = mkRes()
    const next = mkNext()
    mw(req, res as any, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('roleMiddleware returns 403 when role not allowed', () => {
    const mw = roleMiddleware('admin')
    const req: any = { user: { id: 1, email: 'x@y.z', role: 'seller' } }
    const res = mkRes()
    const next = mkNext()
    mw(req, res as any, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  test('roleMiddleware calls next when role allowed', () => {
    const mw = roleMiddleware('admin', 'seller')
    const req: any = { user: { id: 1, email: 'x@y.z', role: 'seller' } }
    const res = mkRes()
    const next = mkNext()
    mw(req, res as any, next)
    expect(next).toHaveBeenCalled()
  })
})
