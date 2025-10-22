import { Product } from '../models/products.model.ts'

export async function getProductsService() {
  return Product.findAll({ limit: 100 })
}
