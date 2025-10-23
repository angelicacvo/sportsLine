import { DataTypes, Model, Sequelize } from 'sequelize'

export interface OrderProductAttributes {
  orderId: number
  productId: number
  quantity: number
  unitPrice: number
  createdAt?: Date
  updatedAt?: Date
}

export type OrderProductCreationDTO = Omit<OrderProductAttributes, 'createdAt' | 'updatedAt'>

export class OrderProduct extends Model<OrderProductAttributes, OrderProductCreationDTO> implements OrderProductAttributes {
  declare orderId: number
  declare productId: number
  declare quantity: number
  declare unitPrice: number
  declare readonly createdAt?: Date
  declare readonly updatedAt?: Date
}

export function initOrderProductsModel(sequelize: Sequelize) {
  OrderProduct.init(
    {
      orderId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: 'order_id' },
      productId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, field: 'product_id' },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'unit_price' },
    },
    { sequelize, tableName: 'order_products', modelName: 'OrderProduct', underscored: true }
  )
}
