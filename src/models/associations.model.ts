import { User } from './users.model.ts';
import { Client } from './clients.model.ts';
import { Product } from './products.model.ts';
import { Order } from './orders.model.ts';
import { OrderProduct } from './orderProducts.model.ts';

export const initAssociations = () => {
    User.hasMany(Client, { foreignKey: 'createdByUserId', as: 'clients' });
    Client.belongsTo(User, { foreignKey: 'createdByUserId', as: 'createdBy' });

    User.hasMany(Product, { foreignKey: 'createdByUserId', as: 'products' });
    Product.belongsTo(User, { foreignKey: 'createdByUserId', as: 'createdBy' });

    // Orders associations
    User.hasMany(Order, { foreignKey: 'createdByUserId', as: 'orders' });
    Order.belongsTo(User, { foreignKey: 'createdByUserId', as: 'createdBy' });

    Client.hasMany(Order, { foreignKey: 'clientId', as: 'orders' });
    Order.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

    // Many-to-many: Orders <-> Products through OrderProduct (with extra fields)
    Order.belongsToMany(Product, {
        through: OrderProduct,
        foreignKey: 'orderId',
        otherKey: 'productId',
        as: 'products'
    });
    Product.belongsToMany(Order, {
        through: OrderProduct,
        foreignKey: 'productId',
        otherKey: 'orderId',
        as: 'orders'
    });
}
