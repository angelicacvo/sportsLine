import { Router } from 'express'
import { getProductsController, getProductByIdController, createProductController, updateProductController, deleteProductController } from '../controllers/product.controller.ts'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.ts'
import { validateBody, validateParams } from '../middlewares/validation.middleware.ts'
import { productCreateSchema, productUpdateSchema, productIdParamSchema } from '../schemas/product.schema.ts'

export const router = Router()

// routes for product resource
// Listar (admin y seller)
router.get('/', authMiddleware, roleMiddleware('admin', 'seller'), getProductsController)
router.get('/:id', authMiddleware, roleMiddleware('admin', 'seller'), validateParams(productIdParamSchema), getProductByIdController)

// Crear, actualizar, eliminar (solo admin)
router.post('/', authMiddleware, roleMiddleware('admin'), validateBody(productCreateSchema), createProductController)
router.put('/:id', authMiddleware, roleMiddleware('admin'), validateParams(productIdParamSchema), validateBody(productUpdateSchema), updateProductController)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), validateParams(productIdParamSchema), deleteProductController)
