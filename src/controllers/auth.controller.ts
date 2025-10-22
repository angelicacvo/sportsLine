import type { Request, Response } from 'express'
import { registerUser, loginUser } from '../services/auth.service.ts'

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body)
    return res.status(201).json({ message: 'User registered', user })
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Registration failed' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const user = await loginUser(req.body)
    // Tokens will be attached in HU2 Task 2
    return res.status(200).json({ message: 'Login successful', user })
  } catch (error: any) {
    return res.status(401).json({ error: error.message || 'Invalid credentials' })
  }
}
