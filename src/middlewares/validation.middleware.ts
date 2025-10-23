import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'
import { errorHandler } from '../utils/error.handle.ts'

// validate request body against a zod schema
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.safeParse(req.body)
      if (!parsed.success) {
        const details = parsed.error.flatten()
        return res.status(400).json({ message: 'Validation error', errors: details })
      }
      return next()
    } catch (e) {
      return errorHandler(res, 'Validation middleware error', e)
    }
  }
}

// validate route params against a zod schema
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.safeParse(req.params)
      if (!parsed.success) {
        const details = parsed.error.flatten()
        return res.status(400).json({ message: 'Validation error', errors: details })
      }
      return next()
    } catch (e) {
      return errorHandler(res, 'Validation middleware error', e)
    }
  }
}

// validate query string against a zod schema
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.safeParse(req.query)
      if (!parsed.success) {
        const details = parsed.error.flatten()
        return res.status(400).json({ message: 'Validation error', errors: details })
      }
      return next()
    } catch (e) {
      return errorHandler(res, 'Validation middleware error', e)
    }
  }
}
