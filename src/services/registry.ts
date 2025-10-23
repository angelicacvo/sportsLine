// service registry to decouple controllers from concrete services
// allows overriding services in tests without esm module mocks

import { registrationService, loginService } from './auth.service.ts'
import {
  getUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
} from './user.service.ts'
import {
  getProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from './product.service.ts'
import {
  getClientsService,
  getClientByIdService,
  createClientService,
  updateClientService,
  deleteClientService,
} from './client.service.ts'
import {
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  deleteOrderService,
} from './order.service.ts'

export type Services = {
  auth: {
    registrationService: typeof registrationService
    loginService: typeof loginService
  }
  user: {
    getUsersService: typeof getUsersService
    getUserByIdService: typeof getUserByIdService
    createUserService: typeof createUserService
    updateUserService: typeof updateUserService
    deleteUserService: typeof deleteUserService
  }
  product: {
    getProductsService: typeof getProductsService
    getProductByIdService: typeof getProductByIdService
    createProductService: typeof createProductService
    updateProductService: typeof updateProductService
    deleteProductService: typeof deleteProductService
  }
  client: {
    getClientsService: typeof getClientsService
    getClientByIdService: typeof getClientByIdService
    createClientService: typeof createClientService
    updateClientService: typeof updateClientService
    deleteClientService: typeof deleteClientService
  }
  order: {
    createOrderService: typeof createOrderService
    getOrdersService: typeof getOrdersService
    getOrderByIdService: typeof getOrderByIdService
    updateOrderStatusService: typeof updateOrderStatusService
    deleteOrderService: typeof deleteOrderService
  }
}

let currentServices: Services = {
  auth: { registrationService, loginService },
  user: { getUsersService, getUserByIdService, createUserService, updateUserService, deleteUserService },
  product: { getProductsService, getProductByIdService, createProductService, updateProductService, deleteProductService },
  client: { getClientsService, getClientByIdService, createClientService, updateClientService, deleteClientService },
  order: { createOrderService, getOrdersService, getOrderByIdService, updateOrderStatusService, deleteOrderService },
}

// returns the current set of services used by controllers
export function getServices() {
  return currentServices
}

// overrides one or more services, useful for testing
export function overrideServices(partial: Partial<{
  [K in keyof Services]: Partial<Services[K]>
}>) {
  currentServices = {
    auth: { ...currentServices.auth, ...(partial.auth || {}) },
    user: { ...currentServices.user, ...(partial.user || {}) },
    product: { ...currentServices.product, ...(partial.product || {}) },
    client: { ...currentServices.client, ...(partial.client || {}) },
    order: { ...currentServices.order, ...(partial.order || {}) },
  }
}

// resets services to their current real implementations
export function resetServices() {
  overrideServices({})
}
