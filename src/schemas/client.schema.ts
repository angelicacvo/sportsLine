import { z } from 'zod'

export const clientCreateSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().email().optional(),
  phone: z.string().min(3).optional(),
})

export const clientUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(3).optional(),
})

export const clientIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform((v) => Number(v)),
})
