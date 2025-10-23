import { jest } from '@jest/globals'
import { getClientsController, getClientByIdController, createClientController, updateClientController, deleteClientController } from '../src/controllers/client.controller.ts'
import { overrideServices, resetServices } from '../src/services/registry.ts'

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('client.controller', () => {
  afterEach(() => { resetServices(); jest.restoreAllMocks() })

  test('getClientsController returns 200', async () => {
    overrideServices({ client: { getClientsService: async () => ([{ id: 1 }] as any) } })
    const res = mockRes()
    await getClientsController({} as any, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test('getClientByIdController not found -> 404', async () => {
    overrideServices({ client: { getClientByIdService: async () => 'Client not found' } })
    const res = mockRes()
    await getClientByIdController({ params: { id: '999' } } as any, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('createClientController success -> 201', async () => {
    overrideServices({ client: { createClientService: async () => ({ id: 1 }) as any } })
    const res = mockRes()
    await createClientController({ body: { name: 'C' } } as any, res)
    expect(res.status).toHaveBeenCalledWith(201)
  })

  test('updateClientController not found -> 404', async () => {
    overrideServices({ client: { updateClientService: async () => 'Client not found' } })
    const res = mockRes()
    await updateClientController({ params: { id: '1' }, body: { name: 'N' } } as any, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('deleteClientController success -> 200', async () => {
    overrideServices({ client: { deleteClientService: async () => true } })
    const res = mockRes()
    await deleteClientController({ params: { id: '1' } } as any, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
