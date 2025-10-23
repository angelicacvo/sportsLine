import { Transaction, Op } from 'sequelize'
import type { WhereOptions } from 'sequelize'
import { sequelize } from '../config/database.config.ts'
import { Order, type OrderCreationDTO } from '../models/orders.model.ts'
import { OrderProduct, type OrderProductCreationDTO } from '../models/orderProducts.model.ts'
import { Product } from '../models/products.model.ts'
import { Client } from '../models/clients.model.ts'

export interface CreateOrderItemInput {
  productId: number
  quantity: number
}

export interface CreateOrderInput {
  clientId: number
  userId: number
  items: CreateOrderItemInput[]
}

export const createOrderDraftService = async (payload: CreateOrderInput) => {
  // Borrador: calcula total y crea líneas SIN validar stock ni descontar inventario (Task 1)
  return await sequelize.transaction(async (transaction: Transaction) => {
    const productIds = payload.items.map((item) => item.productId)
    const productsFound = await Product.findAll({ where: { id: { [Op.in]: productIds } }, transaction })
    const priceById = new Map(productsFound.map((p) => [p.id, Number(p.price)]))

    const orderItems: OrderProductCreationDTO[] = payload.items.map((item) => ({
      orderId: 0, // se setea después de crear la orden
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

export const getOrdersService = async (filter?: { clientId?: number; productId?: number; clientName?: string; productName?: string }) => {
  const where: WhereOptions = {}
  if (filter?.clientId) Object.assign(where, { clientId: filter.clientId })

  const clientInclude: any = { model: Client, as: 'client' }
  if (filter?.clientName) {
    clientInclude.where = { name: { [Op.iLike]: `%${filter.clientName}%` } }
  }

  const productInclude: any = {
    model: Product,
    as: 'products',
    through: { attributes: ['quantity', 'unitPrice'] },
  }
  if (filter?.productId) {
    productInclude.where = { ...(productInclude.where || {}), id: filter.productId }
  }
  if (filter?.productName) {
    productInclude.where = { ...(productInclude.where || {}), name: { [Op.iLike]: `%${filter.productName}%` } }
  }

  const orders = await Order.findAll({ where, include: [clientInclude, productInclude], order: [['id', 'DESC']] })
  return orders
}

export const getOrderByIdService = async (id: number) => {
  const order = await Order.findByPk(id, {
    include: [
      { model: Client, as: 'client' },
      { model: Product, as: 'products', through: { attributes: ['quantity', 'unitPrice'] } },
    ],
  })
  return order ?? 'Order not found'
}
