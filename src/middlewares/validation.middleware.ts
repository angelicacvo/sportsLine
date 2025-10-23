import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'
import { errorHandler } from '../utils/error.handle.ts'

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.safeParse(req.body)
      if (!parsed.success) {
        const details = parsed.error.flatten()
        return res.status(400).json({ message: 'Validation error', errors: details })
      }
      // Solo validamos; no reasignamos req.body para mantenerlo simple y consistente con tus controladores
      return next()
    } catch (e) {
      return errorHandler(res, 'Validation middleware error', e)
    }
  }
}

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.safeParse(req.params)
      if (!parsed.success) {
        const details = parsed.error.flatten()
        return res.status(400).json({ message: 'Validation error', errors: details })
      }
      // Solo validamos; no mutamos req.params
      return next()
    } catch (e) {
      return errorHandler(res, 'Validation middleware error', e)
    }
  }
}

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.safeParse(req.query)
      if (!parsed.success) {
        const details = parsed.error.flatten()
        return res.status(400).json({ message: 'Validation error', errors: details })
      }
      // Solo validamos; no mutamos req.query
      return next()
    } catch (e) {
      return errorHandler(res, 'Validation middleware error', e)
    }
  }
}
