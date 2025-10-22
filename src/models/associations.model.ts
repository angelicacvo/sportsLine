import { User } from './users.model.ts';
import { Client } from './clients.model.ts';
import { Product } from './products.model.ts';

export const initAssociations = () => {
    User.hasMany(Client, { foreignKey: 'createdByUserId', as: 'clients' });
    Client.belongsTo(User, { foreignKey: 'createdByUserId', as: 'createdBy' });

    User.hasMany(Product, { foreignKey: 'createdByUserId', as: 'products' });
    Product.belongsTo(User, { foreignKey: 'createdByUserId', as: 'createdBy' });
}
