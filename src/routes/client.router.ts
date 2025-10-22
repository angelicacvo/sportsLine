import { Router } from 'express'
import { createClientController, deleteClientController, getClientByIdController, getClientsController, updateClientController } from '../controllers/client.controller.ts'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.ts'

export const router = Router()

// Admin y seller pueden listar
router.get('/', authMiddleware, roleMiddleware('admin', 'seller'), getClientsController)
router.get('/:id', authMiddleware, roleMiddleware('admin', 'seller'), getClientByIdController)

// Solo admin puede crear/editar/eliminar
router.post('/', authMiddleware, roleMiddleware('admin'), createClientController)
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateClientController)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteClientController)
