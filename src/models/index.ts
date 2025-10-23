import { sequelize } from '../config/database.config.js';
import { initUsersModel, User } from "./users.model.ts";
import { initClientsModel, Client } from "./clients.model.ts";
import { initProductsModel, Product } from "./products.model.ts";
import { initOrdersModel, Order } from "./orders.model.ts";
import { initOrderProductsModel, OrderProduct } from "./orderProducts.model.ts";
import { initAssociations } from "./associations.model.ts";

// Initialize models
initUsersModel(sequelize);
initClientsModel(sequelize);
initProductsModel(sequelize);
initOrdersModel(sequelize);
initOrderProductsModel(sequelize);

// Apply associations
initAssociations();

export {
  User,
  Client,
  Product,
  Order,
  OrderProduct,
}

export { initAssociations }

export const models = {
  User,
  Client,
  Product,
  Order,
  OrderProduct,
}

export default models;
