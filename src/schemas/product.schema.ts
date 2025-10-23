import { z } from 'zod'

export const productCreateSchema = z.object({
  code: z.string().min(1, 'code is required'),
  name: z.string().min(1, 'name is required'),
  price: z.number().finite('price must be a number').nonnegative('price must be >= 0'),
  stock: z.number().int('stock must be an integer').nonnegative('stock must be >= 0'),
})

export const productUpdateSchema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  price: z.number().finite().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
})

export const productIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform((v) => Number(v)),
})
