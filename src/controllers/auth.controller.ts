import type { Request, Response } from 'express'
import { getServices } from '../services/registry.ts'
import type { RegisterUserDTO, AuthUserDTO } from '../models/users.model.ts'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.handle.ts'
import { errorHandler } from '../utils/error.handle.ts'

// registration controller: creates user and handles error strings from the service
export const registrationController = async (req: Request, res: Response) => {
  try {
    const payload = req.body as RegisterUserDTO
  const result = await getServices().auth.registrationService(payload)
    if (!result) return res.status(400).json({ message: 'Failed to register user' })
    if (typeof result === 'string') return res.status(400).json({ message: result })
    return res.status(201).json({ message: 'User created successfully', user: result })
  } catch (e) {
    errorHandler(res, 'Error registering user', e)
  }
}

// login controller: returns token and user, or 403 on invalid credentials
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as AuthUserDTO
  const result = await getServices().auth.loginService({ email, password })
    if (typeof result === 'string') return res.status(403).json({ message: 'Invalid credentials' })
  const refreshToken = signRefreshToken({ id: result.user.id, email: result.user.email, role: result.user.role })
    return res.status(200).json({ message: 'Login successful', token: result.token, refreshToken, user: result.user })
  } catch (e) {
    errorHandler(res, 'Error logging in', e)
  }
}

// refresh controller: issues new tokens from a refresh token
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
