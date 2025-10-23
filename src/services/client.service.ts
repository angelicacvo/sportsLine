import { Client, type ClientCreationDTO, type ClientUpdateDTO } from '../models/clients.model.ts'

// get a paginated list of clients
export async function getClientsService() {
  return Client.findAll()
}

// get a single client by id
export async function getClientByIdService(id: number) {
  const client = await Client.findByPk(id)
  if (!client) return 'Client not found'
  return client
}

// create a new client with optional email and phone
export async function createClientService(data: ClientCreationDTO) {
  const { name, email, phone } = data
  if (!name) return 'name is required'

  if (email) {
    const exists = await Client.findOne({ where: { email } })
    if (exists) return 'Client email already exists'
  }

  const created = await Client.create({ name, email: email ?? null, phone: phone ?? null })
  return created
}

// update an existing client by id
export async function updateClientService(id: number, data: ClientUpdateDTO) {
  const client = await Client.findByPk(id)
  if (!client) return 'Client not found'

  if (data.email && data.email !== client.email) {
    const exists = await Client.findOne({ where: { email: data.email } })
    if (exists) return 'Client email already exists'
  }

  await client.update(data)
  return client
}

// delete a client by id
export async function deleteClientService(id: number) {
  const client = await Client.findByPk(id)
  if (!client) return 'Client not found'
  await client.destroy()
  return true
}
