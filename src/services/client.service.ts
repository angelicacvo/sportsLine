import { Client } from '../models/clients.model.ts'

export async function getClientsService() {
  return Client.findAll({ limit: 100 })
}
