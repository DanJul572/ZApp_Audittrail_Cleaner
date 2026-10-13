jest.mock('../../models', () => ({ sequelize: {} }));
jest.mock('../../config', () => ({
  logRetention: { enabled: true, intervalHours: 24, days: {} },
}));
jest.mock('../../tasks/auditTrail');

const config = require('../../config');
const auditTrail = require('../../tasks/auditTrail');
const logRetention = require('../../jobs/logRetention');

describe('jobs/logRetention.cleanUp', () => {
  const now = new Date('2026-10-13T00:00:00.000Z');

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers({ now });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => jest.useRealTimers());

  it('should clean up every table that has a retention, with its own cut-off time', async () => {
    config.logRetention.days = { auditTrails: 90, auditLogins: 0, logErrors: 30 };

    await logRetention.cleanUp();

    expect(auditTrail.run).toHaveBeenCalledTimes(2);
    expect(auditTrail.run).toHaveBeenCalledWith({
      table: 'auditTrails',
      before: '2026-07-15T00:00:00.000Z',
    });
    expect(auditTrail.run).toHaveBeenCalledWith({
      table: 'logErrors',
      before: '2026-09-13T00:00:00.000Z',
    });
  });

  it('should go on with the other tables when one fails', async () => {
    config.logRetention.days = { auditTrails: 90, logErrors: 30 };
    auditTrail.run.mockRejectedValueOnce(new Error('lock timeout'));

    await logRetention.cleanUp();

    expect(auditTrail.run).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith(
      'Log retention: could not clean up auditTrails: lock timeout',
    );
  });
});
