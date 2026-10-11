const builders = {
  postgres: {
    auditTrailBuilder: require('./postgres/auditTrailBuilder'),
  },
};

module.exports = builders.postgres;
