import { jest } from '@jest/globals'
import { createClientService } from '../src/services/client.service.ts'
import { Client } from '../src/models/clients.model.ts'

describe('client.service', () => {
  afterEach(() => jest.restoreAllMocks())

  test('createClientService rejects duplicate email', async () => {
    jest.spyOn(Client, 'findOne').mockResolvedValue({ id: 1 } as any)
    const res = await createClientService({ name: 'Acme', email: 'a@a.com', phone: '123' })
    expect(res).toBe('Client email already exists')
  })

  test('getClientByIdService returns not found', async () => {
    jest.spyOn(Client, 'findByPk').mockResolvedValue(null as any)
    const mod = await import('../src/services/client.service.ts')
    const res = await mod.getClientByIdService(123)
    expect(res).toBe('Client not found')
  })

  test('deleteClientService returns not found', async () => {
    jest.spyOn(Client, 'findByPk').mockResolvedValue(null as any)
    const mod = await import('../src/services/client.service.ts')
    const res = await mod.deleteClientService(123)
    expect(res).toBe('Client not found')
  })
})
