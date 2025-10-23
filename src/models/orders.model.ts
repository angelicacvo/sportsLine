import { DataTypes, Model, Sequelize } from 'sequelize'

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled'

export interface OrderAttributes {
  id: number
  clientId: number
  createdByUserId: number
  total: number
  status: OrderStatus
  createdAt?: Date
  updatedAt?: Date
}

export type OrderCreationDTO = Omit<OrderAttributes, 'id' | 'createdAt' | 'updatedAt' | 'total' | 'status'> & {
  // total and status will be computed/set by service layer
  total?: number
  status?: OrderStatus
}

export class Order extends Model<OrderAttributes, OrderCreationDTO> implements OrderAttributes {
  declare id: number
  declare clientId: number
  declare createdByUserId: number
  declare total: number
  declare status: OrderStatus
  declare readonly createdAt?: Date
  declare readonly updatedAt?: Date
}

export function initOrdersModel(sequelize: Sequelize) {
  Order.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      clientId: { type: DataTypes.INTEGER, allowNull: false, field: 'client_id' },
      createdByUserId: { type: DataTypes.INTEGER, allowNull: false, field: 'created_by_user_id' },
      total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'), allowNull: false, defaultValue: 'pending' },
    },
    { sequelize, tableName: 'orders', modelName: 'Order', underscored: true }
  )
}
