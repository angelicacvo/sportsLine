import { jest } from '@jest/globals'
import { createOrderController, updateOrderController, deleteOrderController } from '../src/controllers/order.controller.ts'
import { overrideServices, resetServices } from '../src/services/registry.ts'

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('order.controller (more)', () => {
  afterEach(() => { resetServices(); jest.restoreAllMocks() })

  test('createOrderController success -> 201', async () => {
    overrideServices({ order: { createOrderService: async () => ({ id: 1, total: 100, status: 'confirmed' }) as any } })
    const req: any = { body: { clientId: 1, items: [{ productId: 1, quantity: 1 }] }, user: { id: 99 } }
    const res = mockRes()
    await createOrderController(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  test('updateOrderController not found -> 404', async () => {
    overrideServices({ order: { updateOrderStatusService: async () => 'Order not found' } })
    const req: any = { params: { id: '1' }, body: { status: 'cancelled' }, user: { id: 1 } }
    const res = mockRes()
    await updateOrderController(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deleteOrderController success -> 200', async () => {
    overrideServices({ order: { deleteOrderService: async () => true } })
    const req: any = { params: { id: '1' }, user: { id: 1 } }
    const res = mockRes()
    await deleteOrderController(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
