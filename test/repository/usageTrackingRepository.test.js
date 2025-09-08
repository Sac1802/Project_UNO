import { UsageTrackingRepository } from '../../repository/usageTrackingRepository.js';
import db from '../../models/index.js';
import Either from '../../utils/Either.js';

jest.mock('../../models/index.js', () => ({
    UsageTracking: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
    }
}));

describe('UsageTrackingRepository', () => {
  let repo;

  beforeEach(() => {
    repo = new UsageTrackingRepository();
    jest.clearAllMocks();
  });

  describe('createUsageTracking', () => {
    test('should create usage successfully', async () => {
      const mockUsage = { userId: 1, endpointAccess: '/test', requestMethod: 'GET' };
      db.UsageTracking.create.mockResolvedValue(mockUsage);

      const result = await repo.createUsageTracking(mockUsage);

      expect(db.UsageTracking.create).toHaveBeenCalledWith(mockUsage);
      expect(result).toEqual(Either.right(mockUsage));
    });

    test('should return left if creation fails', async () => {
      db.UsageTracking.create.mockResolvedValue(null);

      const result = await repo.createUsageTracking({});

      expect(result).toEqual(Either.left({ message: 'Failed to create Usage Tracking', statusCode: 500 }));
    });
  });

  describe('getAllUsages', () => {
    test('should return all usages successfully', async () => {
      const mockUsages = [{ id: 1 }, { id: 2 }];
      db.UsageTracking.findAll.mockResolvedValue(mockUsages);

      const result = await repo.getAllUsages();

      expect(db.UsageTracking.findAll).toHaveBeenCalled();
      expect(result).toEqual(Either.right(mockUsages));
    });

    test('should return left if no usages found', async () => {
      db.UsageTracking.findAll.mockResolvedValue([]);

      const result = await repo.getAllUsages();

      expect(result).toEqual(Either.left({ message: 'No Usages Found', statusCode: 404 }));
    });
  });

  describe('getById', () => {
    test('should return usage by id', async () => {
      const mockUsage = { id: 1 };
      db.UsageTracking.findByPk.mockResolvedValue(mockUsage);

      const result = await repo.getById(1);

      expect(db.UsageTracking.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(Either.right(mockUsage));
    });

    test('should return left if usage not found', async () => {
      db.UsageTracking.findByPk.mockResolvedValue(null);

      const result = await repo.getById(1);

      expect(result).toEqual(Either.left({ message: 'The Usage with 1 not found', statusCode: 404 }));
    });
  });

  describe('updateUsageTracking', () => {
    test('should update usage successfully', async () => {
      const mockUsage = { id: 1, save: jest.fn() };
      db.UsageTracking.findOne.mockResolvedValue(mockUsage);
      mockUsage.save.mockResolvedValue(mockUsage);
      const updateData = { endpointAccess: '/updated' };

      const result = await repo.updateUsageTracking(updateData, 'GET', '/test', 1);

      expect(db.UsageTracking.findOne).toHaveBeenCalledWith({
        where: { userId: 1, endpointAccess: '/test', requestMethod: 'GET' }
      });
      expect(mockUsage.save).toHaveBeenCalled();
      expect(result).toEqual(Either.right(mockUsage));
    });

    test('should return left if usage not found', async () => {
      db.UsageTracking.findOne.mockResolvedValue(null);

      const result = await repo.updateUsageTracking({}, 'GET', '/test', 1);

      expect(result).toEqual(Either.left({ message: 'The Usage with 1 not found', statusCode: 404 }));
    });
  });

  describe('getByRequest', () => {
    test('should return usage by request', async () => {
      const mockUsage = { id: 1 };
      db.UsageTracking.findOne.mockResolvedValue(mockUsage);

      const result = await repo.getByRequest('/test', 'GET', 1);

      expect(db.UsageTracking.findOne).toHaveBeenCalledWith({
        where: { endpointAccess: '/test', requestMethod: 'GET', userId: 1 }
      });
      expect(result).toEqual(Either.right(mockUsage));
    });

    test('should return left if usage not found', async () => {
      db.UsageTracking.findOne.mockResolvedValue(null);

      const result = await repo.getByRequest('/test', 'GET', 1);

      expect(result).toEqual(Either.left({ message: 'The Usage with /test not found', statusCode: 404 }));
    });
  });
});