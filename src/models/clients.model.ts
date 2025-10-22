import { DataTypes, Model, Sequelize } from 'sequelize';
import type { Optional } from 'sequelize';

export interface ClientAttributes {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  createdByUserId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ClientCreationDTO = Omit<ClientAttributes, 'id' | 'email' | 'phone' | 'createdByUserId' | 'createdAt' | 'updatedAt'>;
export type ClientUpdateDTO = Pick<ClientAttributes, 'name' | 'email' | 'phone'>;

export class Client extends Model<ClientAttributes, ClientCreationDTO> implements ClientAttributes {
  declare id: number;
  declare name: string;
  declare email: string | null;
  declare phone: string | null;
  declare createdByUserId?: number | null;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
}

export function initClientsModel(sequelize: Sequelize) {
  Client.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: true, unique: true, validate: { isEmail: true } },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      createdByUserId: { type: DataTypes.INTEGER, allowNull: true, field: 'created_by_user_id' },
    },
    { sequelize, tableName: 'clients', modelName: 'Client', underscored: true }
  );
}
