import type { Request, Response } from 'express'
import { errorHandler } from '../utils/error.handle.ts'
import { getProductsService, getProductByIdService, createProductService, updateProductService, deleteProductService } from '../services/product.service.ts'
import type { ProductCreationDTO, ProductUpdateDTO } from '../models/products.model.ts'

export const getProductsController = async (_req: Request, res: Response) => {
  try {
    const products = await getProductsService()
    return res.status(200).json({ products })
  } catch (e) {
    errorHandler(res, 'Error getting products', e)
  }
}

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const result = await getProductByIdService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ product: result })
  } catch (e) {
    errorHandler(res, 'Error getting product', e)
  }
}

export const createProductController = async (req: Request, res: Response) => {
  try {
    const payload = req.body as ProductCreationDTO
    const result = await createProductService(payload)
    if (typeof result === 'string') return res.status(400).json({ message: result })
    return res.status(201).json({ message: 'Product created', product: result })
  } catch (e) {
    errorHandler(res, 'Error creating product', e)
  }
}

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const payload = req.body as ProductUpdateDTO
    const result = await updateProductService(id, payload)
    if (typeof result === 'string') return res.status(result === 'Product not found' ? 404 : 400).json({ message: result })
    return res.status(200).json({ message: 'Product updated', product: result })
  } catch (e) {
    errorHandler(res, 'Error updating product', e)
  }
}

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const result = await deleteProductService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ message: 'Product deleted' })
  } catch (e) {
    errorHandler(res, 'Error deleting product', e)
  }
}
