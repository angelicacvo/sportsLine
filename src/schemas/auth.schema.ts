import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'name must be at least 2 chars'),
  email: z.string().email('invalid email'),
  password: z.string().min(6, 'password must be at least 6 chars'),
})

export const loginSchema = z.object({
  email: z.string().email('invalid email'),
  password: z.string().min(1, 'password is required'),
})
