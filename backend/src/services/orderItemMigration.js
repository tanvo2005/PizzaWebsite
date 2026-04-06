const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

const hasTable = async (tableName) => {
  const rows = await sequelize.query(
    `
      SELECT COUNT(*) AS count
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
        AND table_name = :tableName
    `,
    {
      replacements: { tableName },
      type: QueryTypes.SELECT,
    }
  );

  return Number(rows[0]?.count || 0) > 0;
};

const backfillLegacyOrderItems = async () => {
  const targetTableExists = await hasTable('order_items');
  const legacyTableExists = await hasTable('orderitems');

  if (!targetTableExists || !legacyTableExists) {
    return;
  }

  const [result] = await sequelize.query(`
    INSERT INTO order_items (
      id,
      order_id,
      product_id,
      quantity,
      price,
      total_price,
      size,
      toppings,
      product_name,
      product_description
    )
    SELECT
      legacy.id,
      legacy.orderId,
      legacy.productId,
      legacy.quantity,
      legacy.unitPrice,
      legacy.totalPrice,
      legacy.size,
      legacy.toppings,
      legacy.productName,
      legacy.productDescription
    FROM orderitems AS legacy
    LEFT JOIN order_items AS target ON target.id = legacy.id
    WHERE target.id IS NULL
  `);

  const affectedRows = Number(result?.affectedRows || 0);

  if (affectedRows > 0) {
    console.log(`Migrated ${affectedRows} legacy order item(s) into order_items.`);
  }
};

module.exports = {
  backfillLegacyOrderItems,
};
