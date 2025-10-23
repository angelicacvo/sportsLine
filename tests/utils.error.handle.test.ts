import { jest } from '@jest/globals'
import { errorHandler } from '../src/utils/error.handle.ts'

describe('error.handle', () => {
  test('errorHandler returns message and detail', () => {
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    const err = new Error('Boom')
    errorHandler(res as any, 'Failure', err, 400)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Failure', error: 'Boom' })
  })
})
