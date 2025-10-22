import type { Request, Response } from 'express'
import { errorHandler } from '../utils/error.handle.ts'
import { createClientService, deleteClientService, getClientByIdService, getClientsService, updateClientService } from '../services/client.service.ts'
import type { ClientCreationDTO, ClientUpdateDTO } from '../models/clients.model.ts'

export const getClientsController = async (_req: Request, res: Response) => {
  try {
    const clients = await getClientsService()
    return res.status(200).json({ clients })
  } catch (e) {
    errorHandler(res, 'Error getting clients', e)
  }
}

export const getClientByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const result = await getClientByIdService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ client: result })
  } catch (e) {
    errorHandler(res, 'Error getting client', e)
  }
}

export const createClientController = async (req: Request, res: Response) => {
  try {
    const payload = req.body as ClientCreationDTO
    const result = await createClientService(payload)
    if (typeof result === 'string') return res.status(400).json({ message: result })
    return res.status(201).json({ message: 'Client created', client: result })
  } catch (e) {
    errorHandler(res, 'Error creating client', e)
  }
}

export const updateClientController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const payload = req.body as ClientUpdateDTO
    const result = await updateClientService(id, payload)
    if (typeof result === 'string') return res.status(result === 'Client not found' ? 404 : 400).json({ message: result })
    return res.status(200).json({ message: 'Client updated', client: result })
  } catch (e) {
    errorHandler(res, 'Error updating client', e)
  }
}

export const deleteClientController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const result = await deleteClientService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ message: 'Client deleted' })
  } catch (e) {
    errorHandler(res, 'Error deleting client', e)
  }
}
