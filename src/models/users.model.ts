import { DataTypes, Model, Sequelize } from 'sequelize';
import type { Optional } from 'sequelize';

export type UserRole = 'admin' | 'seller';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationDTO = Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'role'>;
export type UserUpdateDTO = Pick<UserAttributes, 'name' | 'email' | 'password' | 'role'>;

// DTOs colocados en el modelo, como en tu proyecto anterior
export type AuthUserDTO = Pick<UserAttributes, 'email' | 'password'>;

export type RegisterUserDTO = Pick<UserAttributes, 'name' | 'email' | 'password'>;

export class User extends Model<UserAttributes, UserCreationDTO> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
}

export function initUsersModel(sequelize: Sequelize) {
  User.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.ENUM('admin', 'seller'), allowNull: false, defaultValue: 'seller' },
    },
    { sequelize, tableName: 'users', modelName: 'User', underscored: true, timestamps: true }
  );
}
