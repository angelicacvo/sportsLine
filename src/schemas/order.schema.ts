import { z } from 'zod'

export const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
})

export const orderCreateSchema = z.object({
  clientId: z.number().int().positive(),
  items: z.array(orderItemSchema).min(1, 'Order must include at least one item'),
})

export const orderQuerySchema = z.object({
  clientId: z.string().regex(/^\d+$/).transform(Number).optional(),
  productId: z.string().regex(/^\d+$/).transform(Number).optional(),
})

export const orderIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
})

export const orderClientNameParamSchema = z.object({
  name: z.string().min(1),
})

export const orderProductNameParamSchema = z.object({
  name: z.string().min(1),
})
