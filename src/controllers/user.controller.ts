import type { Request, Response } from 'express'
import { errorHandler } from '../utils/error.handle.ts'
import { getServices } from '../services/registry.ts'

// get a paginated list of users (admin only)
export const getUsersController = async (_req: Request, res: Response) => {
  try {
  const users = await getServices().user.getUsersService()
    return res.status(200).json({ users })
  } catch (e) {
    errorHandler(res, 'Error getting users', e)
  }
}

// get a single user by id (admin only)
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
  const result = await getServices().user.getUserByIdService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ user: result })
  } catch (e) {
    errorHandler(res, 'Error getting user', e)
  }
}

// create a new user (admin only)
export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body as { name: string; email: string; password: string; role?: 'admin' | 'seller' }
    const payload: { name: string; email: string; password: string; role?: 'admin' | 'seller' } = { name, email, password }
    if (role !== undefined) payload.role = role
  const result = await getServices().user.createUserService(payload)
    if (typeof result === 'string') return res.status(400).json({ message: result })
    return res.status(201).json({ message: 'User created', user: result })
  } catch (e) {
    errorHandler(res, 'Error creating user', e)
  }
}

// update an existing user by id (admin only)
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { name, email, password, role } = req.body as { name?: string; email?: string; password?: string; role?: 'admin' | 'seller' }
    const payload: { name?: string; email?: string; password?: string; role?: 'admin' | 'seller' } = {}
    if (name !== undefined) payload.name = name
    if (email !== undefined) payload.email = email
    if (password !== undefined) payload.password = password
    if (role !== undefined) payload.role = role
  const result = await getServices().user.updateUserService(id, payload)
    if (typeof result === 'string') return res.status(result === 'User not found' ? 404 : 400).json({ message: result })
    return res.status(200).json({ message: 'User updated', user: result })
  } catch (e) {
    errorHandler(res, 'Error updating user', e)
  }
}

// delete a user by id (admin only)
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
  const result = await getServices().user.deleteUserService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ message: 'User deleted' })
  } catch (e) {
    errorHandler(res, 'Error deleting user', e)
  }
}
