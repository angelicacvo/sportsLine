import { DataTypes, Model, Sequelize } from 'sequelize';
import type { Optional } from 'sequelize';

export interface ProductAttributes {
  id: number;
  code: string;
  name: string;
  price: number;
  stock: number;
  createdByUserId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductCreationDTO = Omit<ProductAttributes, 'id' | 'createdAt' | 'updatedAt' | 'createdByUserId'>;
export type ProductUpdateDTO = Pick<ProductAttributes, 'code' | 'name' | 'price' | 'stock'>;

export class Product extends Model<ProductAttributes, ProductCreationDTO> implements ProductAttributes {
  declare id: number;
  declare code: string;
  declare name: string;
  declare price: number;
  declare stock: number;
  declare createdByUserId?: number | null;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
}

export function initProductsModel(sequelize: Sequelize) {
  Product.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      createdByUserId: { type: DataTypes.INTEGER, allowNull: true, field: 'created_by_user_id' },
    },
    { sequelize, tableName: 'products', modelName: 'Product', underscored: true }
  );
}
