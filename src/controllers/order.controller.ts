import type { Request, Response } from 'express'
import { errorHandler } from '../utils/error.handle.ts'
import { createOrderService, getOrdersService, getOrderByIdService } from '../services/order.service.ts'
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

export const getOrdersController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const orders = await getOrdersService()
    return res.status(200).json({ orders })
  } catch (e) {
    return errorHandler(res, 'Error getting orders', e)
  }
}

export const getOrderByIdController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const id = Number(req.params.id)
    const result = await getOrderByIdService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ order: result })
  } catch (e) {
    return errorHandler(res, 'Error getting order', e)
  }
}

// Removed ID-based search controllers per requirement: only name-based searches are supported now.

export const getOrdersByClientNameController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
  const name = req.params.name
  const filter: { clientName?: string } = {}
  if (typeof name === 'string' && name.length > 0) filter.clientName = name
  const orders = await getOrdersService(filter)
    return res.status(200).json({ orders })
  } catch (e) {
    return errorHandler(res, 'Error getting orders by client name', e)
  }
}

export const getOrdersByProductNameController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
  const name = req.params.name
  const filter: { productName?: string } = {}
  if (typeof name === 'string' && name.length > 0) filter.productName = name
  const orders = await getOrdersService(filter)
    return res.status(200).json({ orders })
  } catch (e) {
    return errorHandler(res, 'Error getting orders by product name', e)
  }
}
