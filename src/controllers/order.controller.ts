import type { Request, Response } from 'express'
import { errorHandler } from '../utils/error.handle.ts'
import { getServices } from '../services/registry.ts'
import type { AuthRequest } from '../middlewares/auth.middleware.ts'
import type { OrderStatus } from '../models/orders.model.ts'

// create an order for a client by validating stock and computing total
export const createOrderController = async (req: AuthRequest, res: Response) => {
  try {
    const { clientId, items } = req.body as { clientId: number; items: { productId: number; quantity: number }[] }
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const userId = req.user.id
  const order = await getServices().order.createOrderService({ clientId, userId, items })
    return res.status(201).json({ message: 'Order created', orderId: order.id, total: order.total, status: order.status })
  } catch (e: unknown) {
    return errorHandler(res, 'Error creating order', e)
  }
}

// list orders with associated client and products
export const getOrdersController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
  const orders = await getServices().order.getOrdersService()
    return res.status(200).json({ orders })
  } catch (e) {
    return errorHandler(res, 'Error getting orders', e)
  }
}

// get a single order by id
export const getOrderByIdController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const id = Number(req.params.id)
  const result = await getServices().order.getOrderByIdService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ order: result })
  } catch (e) {
    return errorHandler(res, 'Error getting order', e)
  }
}

// removed name-based search controllers per requirement: only list all orders

// update order status and adjust stock when needed
export const updateOrderController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const id = Number(req.params.id)
    const { status } = req.body as { status: OrderStatus }
  const result = await getServices().order.updateOrderStatusService(id, status)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ message: 'Order updated', order: result })
  } catch (e) {
    return errorHandler(res, 'Error updating order', e)
  }
}

// delete an order and restore stock when applicable
export const deleteOrderController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const id = Number(req.params.id)
  const result = await getServices().order.deleteOrderService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ message: 'Order deleted' })
  } catch (e) {
    return errorHandler(res, 'Error deleting order', e)
  }
}
