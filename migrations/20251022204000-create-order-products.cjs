"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_products", {
      order_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "orders", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      unit_price: {
        allowNull: false,
        type: Sequelize.DECIMAL(12, 2),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Composite primary key
    await queryInterface.addConstraint("order_products", {
      fields: ["order_id", "product_id"],
      type: "primary key",
      name: "order_products_pkey",
    });

    await queryInterface.addIndex("order_products", ["product_id"], { name: "order_products_product_id_idx" });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("order_products", "order_products_pkey");
    await queryInterface.dropTable("order_products");
  },
};
