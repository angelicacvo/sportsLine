import type { Request, Response } from 'express'
import { errorHandler } from '../utils/error.handle.ts'
import { getProductsService } from '../services/product.service.ts'

export const getProductsController = async (_req: Request, res: Response) => {
  try {
    const products = await getProductsService()
    return res.status(200).json({ products })
  } catch (e) {
    errorHandler(res, 'Error getting products', e)
  }
}
