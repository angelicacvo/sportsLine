import { z } from 'zod'

export const userIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
})

export const userCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'seller']).optional(),
})

export const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['admin', 'seller']).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' })
