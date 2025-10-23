import { jest } from '@jest/globals'
import { getUsersController, getUserByIdController, createUserController, updateUserController, deleteUserController } from '../src/controllers/user.controller.ts'
import { overrideServices, resetServices } from '../src/services/registry.ts'

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('user.controller', () => {
  afterEach(() => { resetServices(); jest.restoreAllMocks() })

  test('getUsersController returns 200', async () => {
    overrideServices({ user: { getUsersService: async () => ([{ id: 1 }] as any) } })
    const res = mockRes()
    await getUsersController({} as any, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test('getUserByIdController not found -> 404', async () => {
    overrideServices({ user: { getUserByIdService: async () => 'User not found' } })
    const res = mockRes()
    await getUserByIdController({ params: { id: '999' } } as any, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('createUserController duplicate -> 400', async () => {
    overrideServices({ user: { createUserService: async () => 'Email already registered' } })
    const res = mockRes()
    await createUserController({ body: { name: 'U', email: 'u@u.com', password: 'x' } } as any, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test('updateUserController success -> 200', async () => {
    overrideServices({ user: { updateUserService: async () => ({ id: 1 }) as any } })
    const res = mockRes()
    await updateUserController({ params: { id: '1' }, body: { name: 'N' } } as any, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test('deleteUserController not found -> 404', async () => {
    overrideServices({ user: { deleteUserService: async () => 'User not found' } })
    const res = mockRes()
    await deleteUserController({ params: { id: '1' } } as any, res)
    expect(res.status).toHaveBeenCalledWith(404)
  })
})
