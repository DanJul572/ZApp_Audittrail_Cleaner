jest.mock('../../models', () => ({ sequelize: {} }));
jest.mock('../../services/auditTrailService');

const auditTrailService = require('../../services/auditTrailService');
const auditTrail = require('../../tasks/auditTrail');

describe('tasks/auditTrail', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it.each(['auditTrails', 'auditLogins', 'logErrors'])('should clean up %s', async table => {
    auditTrailService.deleteBefore.mockResolvedValue(12);

    await expect(auditTrail.run({ table, before: '2026-01-01T00:00:00.000Z' })).resolves.toBe(12);
    expect(auditTrailService.deleteBefore).toHaveBeenCalledWith(
      table,
      new Date('2026-01-01T00:00:00.000Z'),
    );
  });

  it('should refuse a table that is not a log table', async () => {
    await expect(
      auditTrail.run({ table: 'users', before: '2026-01-01T00:00:00.000Z' }),
    ).rejects.toThrow('"users" is not a log table');
    expect(auditTrailService.deleteBefore).not.toHaveBeenCalled();
  });

  it.each([undefined, '', 'yesterday'])('should refuse the time %p', async before => {
    await expect(auditTrail.run({ table: 'auditTrails', before })).rejects.toThrow(
      'is not a valid time',
    );
    expect(auditTrailService.deleteBefore).not.toHaveBeenCalled();
  });
});
