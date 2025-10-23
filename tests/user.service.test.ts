import { jest } from '@jest/globals'
import { getUsersService, getUserByIdService, createUserService, updateUserService, deleteUserService } from '../src/services/user.service.ts'
import { User } from '../src/models/users.model.ts'

describe('user.service', () => {
  afterEach(() => jest.restoreAllMocks())

  test('getUsersService returns list', async () => {
    const items = [{ id: 1 }]
    jest.spyOn(User, 'findAll').mockResolvedValue(items as any)
    const res = await getUsersService()
    expect(res).toBe(items)
  })

  test('getUserByIdService returns not found', async () => {
    jest.spyOn(User, 'findByPk').mockResolvedValue(null as any)
    const res = await getUserByIdService(999)
    expect(res).toBe('User not found')
  })

  test('createUserService rejects duplicate email', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ id: 1 } as any)
    const res = await createUserService({ name: 'A', email: 'a@b.com', password: 'x' })
    expect(res).toBe('Email already registered')
  })

  test('createUserService success with default role', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null as any)
    jest.spyOn(User, 'create').mockResolvedValue({ id: 2, name: 'A', email: 'a@b.com', role: 'seller' } as any)
    const res = await createUserService({ name: 'A', email: 'a@b.com', password: 'x' })
    expect(typeof res).toBe('object')
    if (typeof res !== 'string') {
      expect(res.role).toBe('seller')
    }
  })

  test('updateUserService rejects duplicate email on change', async () => {
    const user = { id: 1, email: 'old@b.com', name: 'Old', save: jest.fn() } as any
    jest.spyOn(User, 'findByPk').mockResolvedValue(user)
    jest.spyOn(User, 'findOne').mockResolvedValue({ id: 2, email: 'new@b.com' } as any)
    const res = await updateUserService(1, { email: 'new@b.com' })
    expect(res).toBe('Email already registered')
  })

  test('updateUserService success updates fields', async () => {
    const user: any = { id: 1, email: 'old@b.com', name: 'Old', role: 'seller', save: jest.fn() }
    jest.spyOn(User, 'findByPk').mockResolvedValue(user)
    jest.spyOn(User, 'findOne').mockResolvedValue(null as any)

    const res = await updateUserService(1, { name: 'New', email: 'new@b.com', role: 'admin' })
    expect(typeof res).toBe('object')
    if (typeof res !== 'string') {
      expect(res.name).toBe('New')
      expect(res.email).toBe('new@b.com')
      expect(res.role).toBe('admin')
    }
    expect(user.save).toHaveBeenCalled()
  })

  test('deleteUserService returns not found', async () => {
    jest.spyOn(User, 'findByPk').mockResolvedValue(null as any)
    const res = await deleteUserService(999)
    expect(res).toBe('User not found')
  })

  test('deleteUserService success', async () => {
    const destroy = jest.fn()
    jest.spyOn(User, 'findByPk').mockResolvedValue({ id: 1, destroy } as any)
    const res = await deleteUserService(1)
    expect(res).toBe(true)
    expect(destroy).toHaveBeenCalled()
  })
})
