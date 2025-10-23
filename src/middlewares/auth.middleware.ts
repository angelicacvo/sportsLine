import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../utils/jwt.handle.ts'

export type UserRole = 'admin' | 'seller'

export interface AuthRequest extends Request {
  user?: { id: number; email: string; role: UserRole }
}

// verify jwt from the authorization header and attach user to request
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization || ''
    const [scheme, token] = auth.split(' ')
    if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Unauthorized' })

    const payload = verifyAccessToken(token)
    req.user = { id: payload.id, email: payload.email, role: payload.role }
    return next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

// ensure the authenticated user has one of the allowed roles
export const roleMiddleware = (...allowed: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' })
    return next()
  }
}
