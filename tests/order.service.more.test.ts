import { jest } from '@jest/globals'
import { getOrderByIdService } from '../src/services/order.service.ts'
import { Order } from '../src/models/orders.model.ts'

describe('order.service (more)', () => {
  afterEach(() => jest.restoreAllMocks())

  test('getOrderByIdService returns not found', async () => {
    jest.spyOn(Order, 'findByPk').mockResolvedValue(null as any)
    const res = await getOrderByIdService(999)
    expect(res).toBe('Order not found')
  })
})
