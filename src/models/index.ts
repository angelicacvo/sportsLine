import { sequelize } from '../config/database.config.js';
import { initUsersModel, User } from "./users.model.ts";
import { initClientsModel, Client } from "./clients.model.ts";
import { initProductsModel, Product } from "./products.model.ts";
import { initAssociations } from "./associations.model.ts";

// Initialize models
initUsersModel(sequelize);
initClientsModel(sequelize);
initProductsModel(sequelize);

// Apply associations
initAssociations();

export {
  User,
  Client,
  Product,
}

export { initAssociations }

export const models = {
  User,
  Client,
  Product,
}

export default models;
