import type { Request, Response } from 'express'
import { errorHandler } from '../utils/error.handle.ts'
import { getServices } from '../services/registry.ts'
import type { ProductCreationDTO, ProductUpdateDTO } from '../models/products.model.ts'

// get a paginated list of products
export const getProductsController = async (_req: Request, res: Response) => {
  try {
  const products = await getServices().product.getProductsService()
    return res.status(200).json({ products })
  } catch (e) {
    errorHandler(res, 'Error getting products', e)
  }
}

// get a single product by id
export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
  const result = await getServices().product.getProductByIdService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ product: result })
  } catch (e) {
    errorHandler(res, 'Error getting product', e)
  }
}

// create a new product
export const createProductController = async (req: Request, res: Response) => {
  try {
    const payload = req.body as ProductCreationDTO
  const result = await getServices().product.createProductService(payload)
    if (typeof result === 'string') return res.status(400).json({ message: result })
    return res.status(201).json({ message: 'Product created', product: result })
  } catch (e) {
    errorHandler(res, 'Error creating product', e)
  }
}

// update an existing product by id
export const updateProductController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const payload = req.body as ProductUpdateDTO
  const result = await getServices().product.updateProductService(id, payload)
    if (typeof result === 'string') return res.status(result === 'Product not found' ? 404 : 400).json({ message: result })
    return res.status(200).json({ message: 'Product updated', product: result })
  } catch (e) {
    errorHandler(res, 'Error updating product', e)
  }
}

// delete a product by id
export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
  const result = await getServices().product.deleteProductService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ message: 'Product deleted' })
  } catch (e) {
    errorHandler(res, 'Error deleting product', e)
  }
}
