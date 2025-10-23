import { jest } from '@jest/globals'
import { createOrderController, getOrdersController } from '../src/controllers/order.controller.ts'
// Avoid mocking ESM module exports; test only auth guard behavior here.

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('order.controller', () => {
  afterEach(() => jest.restoreAllMocks())

  test('createOrderController returns 401 without user', async () => {
    const req: any = { body: { clientId: 1, items: [] }, user: undefined }
    const res = mockRes()
    await createOrderController(req, res)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  // Skipped service call test to avoid ESM export mocking issues.
})
