"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');
    const t = await queryInterface.sequelize.transaction();
    try {
      const rawUsers = [
        {
          name: "Catalina Méndez",
          email: "catalina.mendez@sportsline.co",
          password: "Admin#2025",
          role: "admin",
        },
        {
          name: "Juan Pérez",
          email: "juan.perez@sportsline.co",
          password: "Seller#2025",
          role: "seller",
        },
      ];
      const users = await Promise.all(
        rawUsers.map(async (u) => ({
          ...u,
          password: await bcrypt.hash(u.password, 10),
        }))
      );
      await queryInterface.bulkInsert("users", users, { transaction: t });

      // Fetch inserted user IDs
      const [rows] = await queryInterface.sequelize.query(
        'SELECT id, email FROM "users" WHERE email IN (:emails)',
        { replacements: { emails: users.map(u => u.email) }, transaction: t }
      );
      const admin = rows.find(r => r.email === "catalina.mendez@sportsline.co");
      const seller = rows.find(r => r.email === "juan.perez@sportsline.co");

      // Seed clients
      const clients = [
        {
          name: "Laura Gómez",
          email: "laura.gomez@example.com",
          phone: "+57 311 456 7890",
          created_by_user_id: admin?.id || null,
        },
        {
          name: "Carlos Pineda",
          email: "carlos.pineda@example.com",
          phone: "+57 300 987 6543",
          created_by_user_id: seller?.id || null,
        },
        {
          name: "María Fernanda Torres",
          email: "maria.torres@example.com",
          phone: "+57 315 222 3344",
          created_by_user_id: seller?.id || admin?.id || null,
        },
      ];
      await queryInterface.bulkInsert("clients", clients, { transaction: t });

      // Seed products
      const products = [
        {
          code: "SL-BAL-001",
          name: "Balón Fútbol Adidas Tiro League",
          price: 129900.00,
          stock: 60,
          created_by_user_id: seller?.id || admin?.id || null,
        },
        {
          code: "SL-RAQ-002",
          name: "Raqueta Tenis Wilson Ultra 100L",
          price: 349900.00,
          stock: 18,
          created_by_user_id: seller?.id || admin?.id || null,
        },
        {
          code: "SL-GUA-003",
          name: "Guantes Boxeo Everlast Powerlock",
          price: 189900.00,
          stock: 75,
          created_by_user_id: admin?.id || seller?.id || null,
        },
        {
          code: "SL-ZAP-004",
          name: "Zapatillas Running Nike Pegasus 41",
          price: 499900.00,
          stock: 25,
          created_by_user_id: admin?.id || seller?.id || null,
        },
      ];
      await queryInterface.bulkInsert("products", products, { transaction: t });

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete("products", { code: ["SL-BAL-001", "SL-RAQ-002", "SL-GUA-003", "SL-ZAP-004"] }, { transaction: t });
      await queryInterface.bulkDelete("clients", { email: ["laura.gomez@example.com", "carlos.pineda@example.com", "maria.torres@example.com"] }, { transaction: t });
      await queryInterface.bulkDelete("users", { email: ["catalina.mendez@sportsline.co", "juan.perez@sportsline.co"] }, { transaction: t });
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
};
