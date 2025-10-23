import { jest } from '@jest/globals'
import { updateOrderStatusService, deleteOrderService } from '../src/services/order.service.ts'
import { Order } from '../src/models/orders.model.ts'
import { OrderProduct } from '../src/models/orderProducts.model.ts'
import { Product } from '../src/models/products.model.ts'

describe('order.service update/delete', () => {
  afterEach(() => jest.restoreAllMocks())

  test('updateOrderStatusService confirmed -> cancelled restores stock', async () => {
    const save = jest.fn()
    jest.spyOn(Order, 'findByPk').mockResolvedValue({ id: 10, status: 'confirmed', save } as any)
    jest.spyOn(OrderProduct, 'findAll').mockResolvedValue([
      { orderId: 10, productId: 1, quantity: 2 },
      { orderId: 10, productId: 2, quantity: 1 },
    ] as any)
    const inc = jest.spyOn(Product, 'increment').mockResolvedValue({} as any)

    const res = await updateOrderStatusService(10, 'cancelled')
    expect(typeof res).toBe('object')
    expect(inc).toHaveBeenCalled()
    expect(save).toHaveBeenCalled()
  })

  test('updateOrderStatusService pending -> confirmed validates stock', async () => {
    const save = jest.fn()
    jest.spyOn(Order, 'findByPk').mockResolvedValue({ id: 11, status: 'pending', save } as any)
    jest.spyOn(OrderProduct, 'findAll').mockResolvedValue([{ orderId: 11, productId: 1, quantity: 5 }] as any)
    jest.spyOn(Product, 'findAll').mockResolvedValue([{ id: 1, code: 'X', stock: 2 }] as any)

    await expect(updateOrderStatusService(11, 'confirmed')).rejects.toThrow('Stock insuficiente')
  })

  test('deleteOrderService restores stock for confirmed and deletes', async () => {
    const destroy = jest.fn()
    jest.spyOn(Order, 'findByPk').mockResolvedValue({ id: 12, status: 'confirmed', destroy } as any)
    jest.spyOn(OrderProduct, 'findAll').mockResolvedValue([{ orderId: 12, productId: 1, quantity: 3 }] as any)
    const inc = jest.spyOn(Product, 'increment').mockResolvedValue({} as any)
    const del = jest.spyOn(OrderProduct, 'destroy').mockResolvedValue(1 as any)

    const res = await deleteOrderService(12)
    expect(res).toBe(true)
    expect(inc).toHaveBeenCalled()
    expect(del).toHaveBeenCalled()
    expect(destroy).toHaveBeenCalled()
  })
})
