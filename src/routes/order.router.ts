import { Router } from 'express'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.ts'
import { validateBody, validateParams } from '../middlewares/validation.middleware.ts'
import { orderCreateSchema, orderIdParamSchema, orderClientNameParamSchema, orderProductNameParamSchema } from '../schemas/order.schema.ts'
import { createOrderController, getOrderByIdController, getOrdersController, getOrdersByClientNameController, getOrdersByProductNameController } from '../controllers/order.controller.ts'

export const router = Router()

// Create order (admin and seller)
router.post('/', authMiddleware, roleMiddleware('admin', 'seller'), validateBody(orderCreateSchema), createOrderController)

// List orders with optional filters (admin and seller)
router.get('/', authMiddleware, roleMiddleware('admin', 'seller'), getOrdersController)

// Get order by id (admin and seller)
router.get('/:id', authMiddleware, roleMiddleware('admin', 'seller'), validateParams(orderIdParamSchema), getOrderByIdController)

// Get orders by client name (admin and seller)
router.get('/by-client-name/:name', authMiddleware, roleMiddleware('admin', 'seller'), validateParams(orderClientNameParamSchema), getOrdersByClientNameController)

// Get orders by product name (admin and seller)
router.get('/by-product-name/:name', authMiddleware, roleMiddleware('admin', 'seller'), validateParams(orderProductNameParamSchema), getOrdersByProductNameController)
