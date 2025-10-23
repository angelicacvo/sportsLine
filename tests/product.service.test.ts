import { jest } from '@jest/globals'
import { createProductService, updateProductService } from '../src/services/product.service.ts'
import { Product } from '../src/models/products.model.ts'

describe('product.service', () => {
  afterEach(() => jest.restoreAllMocks())

  test('createProductService rejects duplicate code', async () => {
    jest.spyOn(Product, 'findOne').mockResolvedValue({ id: 1 } as any)
    const res = await createProductService({ code: 'SKU-1', name: 'X', price: 10, stock: 1 })
    expect(res).toBe('Product code already exists')
  })

  test('updateProductService rejects duplicate code when changing', async () => {
    const mockProduct = { id: 1, code: 'ABC', update: jest.fn(), name: 'X', price: 10, stock: 1 } as any
    jest.spyOn(Product, 'findByPk').mockResolvedValue(mockProduct)
    jest.spyOn(Product, 'findOne').mockResolvedValue({ id: 2, code: 'XYZ' } as any)
    const res = await updateProductService(1, { code: 'XYZ', name: 'X', price: 10, stock: 1 })
    expect(res).toBe('Product code already exists')
  })

  test('deleteProductService returns not found when missing', async () => {
    jest.spyOn(Product, 'findByPk').mockResolvedValue(null as any)
    const mod = await import('../src/services/product.service.ts')
    const res = await mod.deleteProductService(999)
    expect(res).toBe('Product not found')
  })

  test('getProductsService returns list', async () => {
    const items = [{ id: 1 }]
    jest.spyOn(Product, 'findAll').mockResolvedValue(items as any)
    const mod = await import('../src/services/product.service.ts')
    const res = await mod.getProductsService()
    expect(res).toBe(items)
  })
})
