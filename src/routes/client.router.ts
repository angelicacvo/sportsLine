import { Router } from 'express'
import { createClientController, deleteClientController, getClientByIdController, getClientsController, updateClientController } from '../controllers/client.controller.ts'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.ts'
import { validateBody, validateParams } from '../middlewares/validation.middleware.ts'
import { clientCreateSchema, clientUpdateSchema, clientIdParamSchema } from '../schemas/client.schema.ts'

export const router = Router()

// Admin y seller pueden listar
router.get('/', authMiddleware, roleMiddleware('admin', 'seller'), getClientsController)
router.get('/:id', authMiddleware, roleMiddleware('admin', 'seller'), validateParams(clientIdParamSchema), getClientByIdController)

// Solo admin puede crear/editar/eliminar
router.post('/', authMiddleware, roleMiddleware('admin'), validateBody(clientCreateSchema), createClientController)
router.put('/:id', authMiddleware, roleMiddleware('admin'), validateParams(clientIdParamSchema), validateBody(clientUpdateSchema), updateClientController)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), validateParams(clientIdParamSchema), deleteClientController)
