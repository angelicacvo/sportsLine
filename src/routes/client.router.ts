import { Router } from 'express'
import { getClientsController } from '../controllers/client.controller.ts'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.ts'

export const router = Router()

// Admin y seller pueden listar clientes
router.get('/', authMiddleware, roleMiddleware('admin', 'seller'), getClientsController)
