import type { Request, Response } from 'express'
import { errorHandler } from '../utils/error.handle.ts'
import { getUsersService } from '../services/user.service.ts'

export const getUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await getUsersService()
    return res.status(200).json({ users })
  } catch (e) {
    errorHandler(res, 'Error getting users', e)
  }
}
