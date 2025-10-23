import { Router } from 'express'
import { getUsersController, getUserByIdController, createUserController, updateUserController, deleteUserController } from '../controllers/user.controller.ts'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.ts'
import { validateBody, validateParams } from '../middlewares/validation.middleware.ts'
import { userCreateSchema, userIdParamSchema, userUpdateSchema } from '../schemas/user.schema.ts'

export const router = Router()

// routes for user resource (admin only)
// Solo admin puede listar usuarios
router.get('/', authMiddleware, roleMiddleware('admin'), getUsersController)
router.get('/:id', authMiddleware, roleMiddleware('admin'), validateParams(userIdParamSchema), getUserByIdController)
router.post('/', authMiddleware, roleMiddleware('admin'), validateBody(userCreateSchema), createUserController)
router.put('/:id', authMiddleware, roleMiddleware('admin'), validateParams(userIdParamSchema), validateBody(userUpdateSchema), updateUserController)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), validateParams(userIdParamSchema), deleteUserController)
