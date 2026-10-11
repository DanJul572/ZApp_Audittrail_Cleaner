jest.mock('../../models', () => ({ sequelize: {} }));
jest.mock('../../config', () => ({ cleanup: { batchSize: 2 } }));
jest.mock('../../queries/auditTrailQuery');

const auditTrailQuery = require('../../queries/auditTrailQuery');
const auditTrailService = require('../../services/auditTrailService');

describe('auditTrailService.deleteBefore', () => {
  const before = new Date('2026-01-01T00:00:00.000Z');

  beforeEach(() => jest.resetAllMocks());

  it('should delete batch after batch until a batch is not full', async () => {
    auditTrailQuery.deleteBatch
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);

    await expect(auditTrailService.deleteBefore('auditTrails', before)).resolves.toBe(5);
    expect(auditTrailQuery.deleteBatch).toHaveBeenCalledTimes(3);
    expect(auditTrailQuery.deleteBatch).toHaveBeenCalledWith('auditTrails', before, 2);
  });

  it('should stop after one statement when nothing is due', async () => {
    auditTrailQuery.deleteBatch.mockResolvedValue(0);

    await expect(auditTrailService.deleteBefore('auditTrails', before)).resolves.toBe(0);
    expect(auditTrailQuery.deleteBatch).toHaveBeenCalledTimes(1);
  });
});
