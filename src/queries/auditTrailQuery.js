const db = require('../models');
const { auditTrailBuilder } = require('../builders');

module.exports = {
  /** Deletes up to `limit` rows created before `before` and returns how many were deleted. */
  async deleteBatch(table, before, limit) {
    try {
      const [, result] = await db.sequelize.query(auditTrailBuilder.deleteBatch(table), {
        replacements: [before, limit],
      });
      return result?.rowCount ?? 0;
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },
};
