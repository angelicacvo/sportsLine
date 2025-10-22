import type { Request, Response } from 'express'
import { errorHandler } from '../utils/error.handle.ts'
import { getClientsService } from '../services/client.service.ts'

export const getClientsController = async (_req: Request, res: Response) => {
  try {
    const clients = await getClientsService()
    return res.status(200).json({ clients })
  } catch (e) {
    errorHandler(res, 'Error getting clients', e)
  }
}
