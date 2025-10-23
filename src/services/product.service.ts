// product services for listing, reading by id, creating, updating, and deleting products
import { Product, type ProductCreationDTO, type ProductUpdateDTO } from '../models/products.model.ts'

// get a paginated list of products
export async function getProductsService() {
  return Product.findAll()
}

// get a single product by id
export async function getProductByIdService(id: number) {
  const product = await Product.findByPk(id)
  if (!product) return 'Product not found'
  return product
}

// create a new product with unique code
export async function createProductService(data: ProductCreationDTO) {
  const { code, name, price, stock } = data
  if (!code || !name || price == null || stock == null) return 'Missing required fields'

  const exists = await Product.findOne({ where: { code } })
  if (exists) return 'Product code already exists'

  const product = await Product.create({ code, name, price, stock })
  return product
}

// update an existing product by id
export async function updateProductService(id: number, data: ProductUpdateDTO) {
  const product = await Product.findByPk(id)
  if (!product) return 'Product not found'

  // ensure product code uniqueness when updating
  if (data.code && data.code !== product.code) {
    const exists = await Product.findOne({ where: { code: data.code } })
    if (exists) return 'Product code already exists'
  }

  await product.update(data)
  return product
}

// delete a product by id
export async function deleteProductService(id: number) {
  const product = await Product.findByPk(id)
  if (!product) return 'Product not found'
  await product.destroy()
  return true
}
