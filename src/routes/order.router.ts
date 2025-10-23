import { Router } from 'express'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.ts'
import { validateBody } from '../middlewares/validation.middleware.ts'
import { orderCreateSchema } from '../schemas/order.schema.ts'
import { createOrderController } from '../controllers/order.controller.ts'

export const router = Router()

// Create order (admin and seller)
router.post('/', authMiddleware, roleMiddleware('admin', 'seller'), validateBody(orderCreateSchema), createOrderController)
