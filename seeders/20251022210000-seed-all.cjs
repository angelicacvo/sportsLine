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

      // Fetch clients and products to build orders
      const [clientRows] = await queryInterface.sequelize.query(
        'SELECT id, email FROM "clients" WHERE email IN (:emails)',
        { replacements: { emails: clients.map(c => c.email) }, transaction: t }
      );
      const [productRows] = await queryInterface.sequelize.query(
        'SELECT id, code, price FROM "products" WHERE code IN (:codes)',
        { replacements: { codes: products.map(p => p.code) }, transaction: t }
      );

      const findClient = (email) => clientRows.find((c) => c.email === email)?.id;
      const findProduct = (code) => productRows.find((p) => p.code === code);

      // Prepare orders (status confirmed)
      const orderData = [
        {
          key: 'A',
          clientEmail: 'laura.gomez@example.com',
          createdBy: seller?.id || admin?.id,
          items: [
            { code: 'SL-BAL-001', qty: 2 },
            { code: 'SL-GUA-003', qty: 1 },
          ],
        },
        {
          key: 'B',
          clientEmail: 'carlos.pineda@example.com',
          createdBy: admin?.id || seller?.id,
          items: [
            { code: 'SL-RAQ-002', qty: 1 },
            { code: 'SL-ZAP-004', qty: 1 },
          ],
        },
        {
          key: 'C',
          clientEmail: 'maria.torres@example.com',
          createdBy: seller?.id || admin?.id,
          items: [
            { code: 'SL-ZAP-004', qty: 2 },
          ],
        },
      ];

      const ordersToInsert = orderData.map((o) => {
        const clientId = findClient(o.clientEmail);
        let total = 0;
        o.items.forEach((it) => {
          const prod = findProduct(it.code);
          const price = Number(prod?.price || 0);
          total += price * it.qty;
        });
        return {
          client_id: clientId,
          created_by_user_id: o.createdBy,
          total: Number(total.toFixed(2)),
          status: 'confirmed',
        };
      });

      await queryInterface.bulkInsert('orders', ordersToInsert, { transaction: t });

      // Retrieve inserted orders
      const [orderRows] = await queryInterface.sequelize.query(
        'SELECT id, client_id, created_by_user_id, total FROM "orders" WHERE client_id IN (:clientIds) AND created_by_user_id IN (:userIds) AND status = :status',
        {
          replacements: {
            clientIds: ordersToInsert.map(o => o.client_id),
            userIds: [admin?.id, seller?.id].filter(Boolean),
            status: 'confirmed',
          },
          transaction: t,
        }
      );

      const findOrderId = (clientId, userId, total) => {
        const row = orderRows.find(r => r.client_id === clientId && r.created_by_user_id === userId && Number(r.total) === Number(total));
        return row?.id;
      };

      // Build order_products rows
      const orderProductRows = [];
      for (const od of orderData) {
        const clientId = findClient(od.clientEmail);
        let total = 0;
        for (const it of od.items) {
          const pr = findProduct(it.code);
          const price = Number(pr?.price || 0);
          total += price * it.qty;
        }
        const orderId = findOrderId(clientId, od.createdBy, Number(total.toFixed(2)));
        for (const it of od.items) {
          const pr = findProduct(it.code);
          orderProductRows.push({
            order_id: orderId,
            product_id: pr?.id,
            quantity: it.qty,
            unit_price: Number(pr?.price || 0),
          });
        }
      }

      await queryInterface.bulkInsert('order_products', orderProductRows, { transaction: t });

      // Adjust stocks to reflect orders
      const stockAdjustments = {
        'SL-BAL-001': -2,
        'SL-GUA-003': -1,
        'SL-RAQ-002': -1,
        'SL-ZAP-004': -3,
      };
      for (const code of Object.keys(stockAdjustments)) {
        const delta = stockAdjustments[code];
        // Update with raw SQL to perform arithmetic
        await queryInterface.sequelize.query(
          'UPDATE "products" SET stock = stock + :delta WHERE code = :code',
          { replacements: { delta, code }, transaction: t }
        );
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      // Restore product stock back to original values
      await queryInterface.sequelize.query('UPDATE "products" SET stock = 60 WHERE code = :code', { replacements: { code: 'SL-BAL-001' }, transaction: t });
      await queryInterface.sequelize.query('UPDATE "products" SET stock = 75 WHERE code = :code', { replacements: { code: 'SL-GUA-003' }, transaction: t });
      await queryInterface.sequelize.query('UPDATE "products" SET stock = 18 WHERE code = :code', { replacements: { code: 'SL-RAQ-002' }, transaction: t });
      await queryInterface.sequelize.query('UPDATE "products" SET stock = 25 WHERE code = :code', { replacements: { code: 'SL-ZAP-004' }, transaction: t });

      // Delete seeded orders (order_products will cascade)
      // Find relevant clients and users
      const [uRows] = await queryInterface.sequelize.query(
        'SELECT id, email FROM "users" WHERE email IN (:emails)',
        { replacements: { emails: ["catalina.mendez@sportsline.co", "juan.perez@sportsline.co"] }, transaction: t }
      );
      const [cRows] = await queryInterface.sequelize.query(
        'SELECT id, email FROM "clients" WHERE email IN (:emails)',
        { replacements: { emails: ["laura.gomez@example.com", "carlos.pineda@example.com", "maria.torres@example.com"] }, transaction: t }
      );
      const userIds = uRows.map(u => u.id);
      const clientIds = cRows.map(c => c.id);
      await queryInterface.sequelize.query(
        'DELETE FROM "orders" WHERE client_id IN (:clientIds) AND created_by_user_id IN (:userIds) AND status = :status',
        { replacements: { clientIds, userIds, status: 'confirmed' }, transaction: t }
      );

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
