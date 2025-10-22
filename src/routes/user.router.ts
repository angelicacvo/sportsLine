import { Router } from 'express'
import { getUsersController } from '../controllers/user.controller.ts'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.ts'

export const router = Router()

// Solo admin puede listar usuarios
router.get('/', authMiddleware, roleMiddleware('admin'), getUsersController)
