import { jest } from '@jest/globals'
import { createOrderService } from '../src/services/order.service.ts'
import { Product } from '../src/models/products.model.ts'
import { Order } from '../src/models/orders.model.ts'
import { OrderProduct } from '../src/models/orderProducts.model.ts'

describe('order.service', () => {
  afterEach(() => jest.restoreAllMocks())

  test('createOrderService throws on insufficient stock', async () => {
    jest.spyOn(Product, 'findAll').mockResolvedValue([
      { id: 1, price: 100, stock: 1 } as any,
    ])
    await expect(
      createOrderService({ clientId: 1, userId: 1, items: [{ productId: 1, quantity: 2 }] })
    ).rejects.toThrow('Stock insuficiente')
  })

  test('createOrderService success creates order and decrements stock', async () => {
    const p1 = { id: 1, price: 100, stock: 5, decrement: jest.fn() } as any
    const p2 = { id: 2, price: 50, stock: 3, decrement: jest.fn() } as any
    jest.spyOn(Product, 'findAll').mockResolvedValue([p1, p2])
    jest.spyOn(Order, 'create').mockResolvedValue({ id: 10, total: 300, status: 'confirmed' } as any)
    const bulkSpy = jest.spyOn(OrderProduct, 'bulkCreate').mockResolvedValue([] as any)

    const order = await createOrderService({
      clientId: 1,
      userId: 1,
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 2 },
      ],
    })

    expect(order.id).toBe(10)
    expect(p1.decrement).toHaveBeenCalledWith('stock', expect.objectContaining({ by: 2, transaction: expect.anything() }))
    expect(p2.decrement).toHaveBeenCalled()
    expect(bulkSpy).toHaveBeenCalled()
  })
})
