import type { Request, Response } from 'express'
import { errorHandler } from '../utils/error.handle.ts'
import { createOrderService } from '../services/order.service.ts'
import type { AuthRequest } from '../middlewares/auth.middleware.ts'

export const createOrderController = async (req: AuthRequest, res: Response) => {
  try {
    const { clientId, items } = req.body as { clientId: number; items: { productId: number; quantity: number }[] }
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const userId = req.user.id
    const order = await createOrderService({ clientId, userId, items })
    return res.status(201).json({ message: 'Order created', orderId: order.id, total: order.total, status: order.status })
  } catch (e: unknown) {
    return errorHandler(res, 'Error creating order', e)
  }
}
