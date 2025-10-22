import type { Request, Response } from 'express'
import { registrationService, loginService } from '../services/auth.service.ts'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.handle.ts'
import { errorHandler } from '../utils/error.handle.ts'

// registrationController: crea usuario, maneja strings de error desde el servicio
export const registrationController = async (req: Request, res: Response) => {
  try {
    const result = await registrationService(req.body)
    if (!result) return res.status(400).json({ message: 'Failed to register user' })
    if (typeof result === 'string') return res.status(400).json({ message: result })
    return res.status(201).json({ message: 'User created successfully', user: result })
  } catch (e) {
    errorHandler(res, 'Error registering user', e)
  }
}

// loginController: devuelve token + user, o 403 si credenciales inválidas
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await loginService({ email, password })
    if (typeof result === 'string') return res.status(403).json({ message: 'Invalid credentials' })
    // Opcional: también emitir refresh token si lo requieres en Task 2
    const refreshToken = signRefreshToken({ id: result.user.id, email: result.user.email, role: result.user.role as any })
    return res.status(200).json({ message: 'Login successful', token: result.token, refreshToken, user: result.user })
  } catch (e) {
    errorHandler(res, 'Error logging in', e)
  }
}

// refreshController: genera nuevos tokens a partir del refresh token
export const refreshController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string }
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken is required' })

    const payload = verifyRefreshToken(refreshToken)
    const accessToken = signAccessToken({ id: payload.id, email: payload.email, role: payload.role })
    const newRefreshToken = signRefreshToken({ id: payload.id, email: payload.email, role: payload.role })
    return res.status(200).json({ token: accessToken, refreshToken: newRefreshToken })
  } catch (e) {
    errorHandler(res, 'Invalid refresh token', e)
  }
}
