import type { Request, Response } from 'express'
import { errorHandler } from '../utils/error.handle.ts'
import { getServices } from '../services/registry.ts'
import type { ClientCreationDTO, ClientUpdateDTO } from '../models/clients.model.ts'

// get a paginated list of clients
export const getClientsController = async (_req: Request, res: Response) => {
  try {
  const clients = await getServices().client.getClientsService()
    return res.status(200).json({ clients })
  } catch (e) {
    errorHandler(res, 'Error getting clients', e)
  }
}

// get a single client by id
export const getClientByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
  const result = await getServices().client.getClientByIdService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ client: result })
  } catch (e) {
    errorHandler(res, 'Error getting client', e)
  }
}

// create a new client
export const createClientController = async (req: Request, res: Response) => {
  try {
    const payload = req.body as ClientCreationDTO
  const result = await getServices().client.createClientService(payload)
    if (typeof result === 'string') return res.status(400).json({ message: result })
    return res.status(201).json({ message: 'Client created', client: result })
  } catch (e) {
    errorHandler(res, 'Error creating client', e)
  }
}

// update an existing client by id
export const updateClientController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const payload = req.body as ClientUpdateDTO
  const result = await getServices().client.updateClientService(id, payload)
    if (typeof result === 'string') return res.status(result === 'Client not found' ? 404 : 400).json({ message: result })
    return res.status(200).json({ message: 'Client updated', client: result })
  } catch (e) {
    errorHandler(res, 'Error updating client', e)
  }
}

// delete a client by id
export const deleteClientController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
  const result = await getServices().client.deleteClientService(id)
    if (typeof result === 'string') return res.status(404).json({ message: result })
    return res.status(200).json({ message: 'Client deleted' })
  } catch (e) {
    errorHandler(res, 'Error deleting client', e)
  }
}
