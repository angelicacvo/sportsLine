import { Router } from 'express'
import { getProductsController } from '../controllers/product.controller.ts'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.ts'

export const router = Router()

// Admin y seller pueden listar productos
router.get('/', authMiddleware, roleMiddleware('admin', 'seller'), getProductsController)
