import { UsageTrackingRepository } from '../../repository/usageTrackingRepository.js';
import UsageTracking from '../../models/usageTracking.js';
import Either from '../../utils/Either.js';

jest.mock('../../models/usageTracking.js');

describe('UsageTrackingRepository', () => {
  let repo;

  beforeEach(() => {
    repo = new UsageTrackingRepository();
    jest.clearAllMocks();
  });

  describe('createUsageTracking', () => {
    test('should create usage successfully', async () => {
      const mockUsage = { userId: 1, endpointAccess: '/test', requestMethod: 'GET' };
      UsageTracking.create.mockResolvedValue(mockUsage);

      const result = await repo.createUsageTracking(mockUsage);

      expect(UsageTracking.create).toHaveBeenCalledWith(mockUsage);
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockUsage);
    });

    test('should return left if creation fails', async () => {
      UsageTracking.create.mockResolvedValue(null);

      const result = await repo.createUsageTracking({});

      expect(result.isLeft()).toBe(true);
      expect(result.value.message).toBe('Failed to create Usage Tracking');
      expect(result.value.statusCode).toBe(500);
    });
  });

  describe('getAllUsages', () => {
    test('should return all usages successfully', async () => {
      const mockUsages = [{ id: 1 }, { id: 2 }];
      UsageTracking.findAll.mockResolvedValue(mockUsages);

      const result = await repo.getAllUsages();

      expect(UsageTracking.findAll).toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockUsages);
    });

    test('should return left if no usages found', async () => {
      UsageTracking.findAll.mockResolvedValue([]);

      const result = await repo.getAllUsages();

      expect(result.isLeft()).toBe(true);
      expect(result.value.message).toBe('No Usages Found');
      expect(result.value.statusCode).toBe(404);
    });
  });

  describe('getById', () => {
    test('should return usage by id', async () => {
      const mockUsage = { id: 1 };
      UsageTracking.findByPk.mockResolvedValue(mockUsage);

      const result = await repo.getById(1);

      expect(UsageTracking.findByPk).toHaveBeenCalledWith(1);
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockUsage);
    });

    test('should return left if usage not found', async () => {
      UsageTracking.findByPk.mockResolvedValue(null);

      const result = await repo.getById(1);

      expect(result.isLeft()).toBe(true);
      expect(result.value.statusCode).toBe(404);
      expect(result.value.message).toBe('The Usage with 1 not found');
    });
  });

  describe('updateUsageTracking', () => {
    test('should update usage successfully', async () => {
      const mockUsage = { id: 1, save: jest.fn() };
      UsageTracking.findOne.mockResolvedValue(mockUsage);
      const updateData = { endpointAccess: '/updated' };

      const result = await repo.updateUsageTracking(updateData, 'GET', '/test', 1);

      expect(UsageTracking.findOne).toHaveBeenCalledWith({
        where: { userId: 1, endpointAccess: '/test', requestMethod: 'GET' }
      });
      expect(mockUsage.save).toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
      expect(result.right.endpointAccess).toBe('/updated');
    });

    test('should return left if usage not found', async () => {
      UsageTracking.findOne.mockResolvedValue(null);

      const result = await repo.updateUsageTracking({}, 'GET', '/test', 1);

      expect(result.isLeft()).toBe(true);
      expect(result.value.statusCode).toBe(404);
    });
  });

  describe('getByRequest', () => {
    test('should return usage by request', async () => {
      const mockUsage = { id: 1 };
      UsageTracking.findOne.mockResolvedValue(mockUsage);

      const result = await repo.getByRequest('/test', 'GET', 1);

      expect(UsageTracking.findOne).toHaveBeenCalledWith({
        where: { endpointAccess: '/test', requestMethod: 'GET', userId: 1 }
      });
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockUsage);
    });

    test('should return left if usage not found', async () => {
      UsageTracking.findOne.mockResolvedValue(null);

      const result = await repo.getByRequest('/test', 'GET', 1);

      expect(result.isLeft()).toBe(true);
      expect(result.value.statusCode).toBe(404);
      expect(result.value.message).toBe('The Usage with /test not found');
    });
  });
});
