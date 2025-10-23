import { jest } from '@jest/globals'
import { getProductsController, getProductByIdController, createProductController, updateProductController, deleteProductController } from '../src/controllers/product.controller.ts'
import { overrideServices, resetServices } from '../src/services/registry.ts'

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('product.controller', () => {
  afterEach(() => { resetServices(); jest.restoreAllMocks() })

  test('getProductsController returns 200', async () => {
    overrideServices({ product: { getProductsService: async () => ([{ id: 1 }] as any) } })
    const res = mockRes()
    await getProductsController({} as any, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test('getProductByIdController not found -> 404', async () => {
    overrideServices({ product: { getProductByIdService: async () => 'Product not found' } })
    const res = mockRes()
    await getProductByIdController({ params: { id: '999' } } as any, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('createProductController error -> 400', async () => {
    overrideServices({ product: { createProductService: async () => 'Product code already exists' } })
    const res = mockRes()
    await createProductController({ body: { code: 'X', name: 'N', price: 1, stock: 1 } } as any, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test('updateProductController success -> 200', async () => {
    overrideServices({ product: { updateProductService: async () => ({ id: 1 }) as any } })
    const res = mockRes()
    await updateProductController({ params: { id: '1' }, body: { name: 'N' } } as any, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test('deleteProductController not found -> 404', async () => {
    overrideServices({ product: { deleteProductService: async () => 'Product not found' } })
    const res = mockRes()
    await deleteProductController({ params: { id: '999' } } as any, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })
})
