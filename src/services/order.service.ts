import { Transaction, Op } from 'sequelize'
// removed whereoptions: listing does not use filters
import { sequelize } from '../config/database.config.ts'
import { Order, type OrderCreationDTO } from '../models/orders.model.ts'
import { OrderProduct, type OrderProductCreationDTO } from '../models/orderProducts.model.ts'
import { Product } from '../models/products.model.ts'
import { Client } from '../models/clients.model.ts'
import type { OrderStatus } from '../models/orders.model.ts'

export interface CreateOrderItemInput {
  productId: number
  quantity: number
}

export interface CreateOrderInput {
  clientId: number
  userId: number
  items: CreateOrderItemInput[]
}

// compute a draft order without stock validation or inventory changes
export const createOrderDraftService = async (payload: CreateOrderInput) => {
  return await sequelize.transaction(async (transaction: Transaction) => {
    const productIds = payload.items.map((item) => item.productId)
    const productsFound = await Product.findAll({ where: { id: { [Op.in]: productIds } }, transaction })
    const priceById = new Map(productsFound.map((p) => [p.id, Number(p.price)]))

    const orderItems: OrderProductCreationDTO[] = payload.items.map((item) => ({
// create a confirmed order, validate stock, and decrement inventory atomically
      orderId: 0, 
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: priceById.get(item.productId) ?? 0,
    }))

    const total = orderItems.reduce((sum, item) => sum + item.quantity * Number(item.unitPrice), 0)

    const draftOrderPayload: OrderCreationDTO = {
      clientId: payload.clientId,
      createdByUserId: payload.userId,
      total,
      status: 'pending',
    }
    const order = await Order.create(draftOrderPayload, { transaction })

    for (const item of orderItems) item.orderId = order.id
    await OrderProduct.bulkCreate(orderItems, { transaction })
    return order
  })
}

export const createOrderService = async (payload: CreateOrderInput) => {
  // Task 2: valida stock y descuenta inventario dentro de una transacción sencilla
  return await sequelize.transaction(async (transaction: Transaction) => {
    if (!payload.items?.length) throw new Error('El pedido debe incluir al menos un producto')

    const productIds = payload.items.map((item) => item.productId)
    const productsFound = await Product.findAll({ where: { id: { [Op.in]: productIds } }, transaction })
    const productById = new Map(productsFound.map((p) => [p.id, p]))

    // Validar stock y calcular total con el precio actual
    let total = 0
    for (const item of payload.items) {
      if (item.quantity <= 0) throw new Error('La cantidad debe ser mayor a 0')
      const product = productById.get(item.productId)
      if (!product) throw new Error(`Producto ${item.productId} no existe`)
      if (product.stock < item.quantity) throw new Error(`Stock insuficiente para el producto ${product.code}`)
      total += item.quantity * Number(product.price)
    }

    // Crear la orden confirmada
    const confirmedOrderPayload: OrderCreationDTO = {
      clientId: payload.clientId,
      createdByUserId: payload.userId,
      total,
      status: 'confirmed',
    }
    const order = await Order.create(confirmedOrderPayload, { transaction })

    // Crear líneas y descontar inventario
    const orderItems: OrderProductCreationDTO[] = []
    for (const item of payload.items) {
      const product = productById.get(item.productId)!
      orderItems.push({ orderId: order.id, productId: product.id, quantity: item.quantity, unitPrice: Number(product.price) })
      await product.decrement('stock', { by: item.quantity, transaction })
    }
    await OrderProduct.bulkCreate(orderItems, { transaction })

    return order
  })
}

// list all orders without filters or relations
export const getOrdersService = async () => {
  return Order.findAll()
}

// get a single order by id
export const getOrderByIdService = async (id: number) => {
  const order = await Order.findByPk(id)
  return order ?? 'Order not found'
}

// update order status and adjust inventory according to transitions
export const updateOrderStatusService = async (id: number, status: OrderStatus) => {
  return await sequelize.transaction(async (transaction: Transaction) => {
    const order = await Order.findByPk(id, {
      include: [{ model: Product, as: 'products', through: { attributes: ['quantity', 'unitPrice'] } }],
      transaction,
    })
    if (!order) return 'Order not found'

    if (order.status === status) return order

    // Build a map of productId -> quantity from pivot
    const items = await OrderProduct.findAll({ where: { orderId: order.id }, transaction })

    if (status === 'cancelled' && order.status === 'confirmed') {
      // Restore stock
      for (const it of items) {
        await Product.increment('stock', { by: it.quantity, where: { id: it.productId }, transaction })
      }
      order.status = 'cancelled'
      await order.save({ transaction })
      return order
    }

    if ((status === 'confirmed' && order.status === 'cancelled') || (status === 'confirmed' && order.status === 'pending')) {
      // Validate stock then decrement
      const products = await Product.findAll({ where: { id: { [Op.in]: items.map(i => i.productId) } }, transaction })
      const byId = new Map(products.map(p => [p.id, p]))
      for (const it of items) {
        const p = byId.get(it.productId)
        if (!p) throw new Error(`Producto ${it.productId} no existe`)
        if (p.stock < it.quantity) throw new Error(`Stock insuficiente para el producto ${p.code}`)
      }
      for (const it of items) {
        await Product.decrement('stock', { by: it.quantity, where: { id: it.productId }, transaction })
      }
      order.status = 'confirmed'
      await order.save({ transaction })
      return order
    }

    if (status === 'pending' && order.status === 'confirmed') {
      // Move back to pending: restore stock
      for (const it of items) {
        await Product.increment('stock', { by: it.quantity, where: { id: it.productId }, transaction })
      }
      order.status = 'pending'
      await order.save({ transaction })
      return order
    }

    // Other transitions (cancelled -> pending) do not affect stock
    order.status = status
    await order.save({ transaction })
    return order
  })
}

// delete an order and restore stock when needed
export const deleteOrderService = async (id: number) => {
  return await sequelize.transaction(async (transaction: Transaction) => {
    const order = await Order.findByPk(id, { transaction })
    if (!order) return 'Order not found'

    // Restore stock if confirmed
    if (order.status === 'confirmed') {
      const items = await OrderProduct.findAll({ where: { orderId: order.id }, transaction })
      for (const it of items) {
        await Product.increment('stock', { by: it.quantity, where: { id: it.productId }, transaction })
      }
    }

    // Delete pivot then order
    await OrderProduct.destroy({ where: { orderId: order.id }, transaction })
    await order.destroy({ transaction })
    return true
  })
}
