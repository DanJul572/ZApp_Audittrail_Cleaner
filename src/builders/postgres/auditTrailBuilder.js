// The table name is checked against a fixed list before it gets here (see tasks/auditTrail.js).
function deleteBatch(table) {
  return (
    `DELETE FROM "${table}" WHERE "id" IN ` +
    `(SELECT "id" FROM "${table}" WHERE "createdAt" < ? LIMIT ?)`
  );
}

module.exports = {
  deleteBatch,
};
