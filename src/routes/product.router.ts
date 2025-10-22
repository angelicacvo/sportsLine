import { Router } from 'express'
import { getProductsController, getProductByIdController, createProductController, updateProductController, deleteProductController } from '../controllers/product.controller.ts'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.ts'

export const router = Router()

// Listar (admin y seller)
router.get('/', authMiddleware, roleMiddleware('admin', 'seller'), getProductsController)
router.get('/:id', authMiddleware, roleMiddleware('admin', 'seller'), getProductByIdController)

// Crear, actualizar, eliminar (solo admin)
router.post('/', authMiddleware, roleMiddleware('admin'), createProductController)
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateProductController)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteProductController)
