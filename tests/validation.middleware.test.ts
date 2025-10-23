import { jest } from '@jest/globals'
import { z } from 'zod'
import { validateBody, validateParams, validateQuery } from '../src/middlewares/validation.middleware.ts'

const mkRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const mkNext = () => jest.fn()

describe('validation.middleware', () => {
  test('validateBody returns 400 on invalid body', () => {
    const schema = z.object({ name: z.string().min(1) })
    const mw = validateBody(schema)
    const req: any = { body: { name: '' } }
    const res = mkRes()
    const next = mkNext()
    mw(req, res as any, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('validateBody calls next on valid body', () => {
    const schema = z.object({ name: z.string().min(1) })
    const mw = validateBody(schema)
    const req: any = { body: { name: 'ok' } }
    const res = mkRes()
    const next = mkNext()
    mw(req, res as any, next)
    expect(next).toHaveBeenCalled()
  })

  test('validateParams returns 400 on invalid params', () => {
    const schema = z.object({ id: z.string().regex(/^\d+$/) })
    const mw = validateParams(schema)
    const req: any = { params: { id: 'abc' } }
    const res = mkRes()
    const next = mkNext()
    mw(req, res as any, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(next).not.toHaveBeenCalled()
  })

  test('validateQuery calls next on valid query', () => {
    const schema = z.object({ q: z.string().optional() })
    const mw = validateQuery(schema)
    const req: any = { query: { q: 'term' } }
    const res = mkRes()
    const next = mkNext()
    mw(req, res as any, next)
    expect(next).toHaveBeenCalled()
  })
})
