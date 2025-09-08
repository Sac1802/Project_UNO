import { TurnHistoryRepository } from '../../repository/turnHistoryRepository.js';
import db from '../../models/index.js';
import Either from '../../utils/Either.js';

jest.mock('../../models/index.js', () => ({
    turnHistory: {
        create: jest.fn(),
        findAll: jest.fn(),
    }
}));

describe('TurnHistoryRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new TurnHistoryRepository();
    jest.clearAllMocks();
  });

  describe('saveHistoryTurn', () => {
    test('should save a new turn history', async () => {
      const mockData = { action: 'draw', gameId: 1, playerId: 1 };
      const mockReturn = { id: 1, ...mockData };
      db.turnHistory.create.mockResolvedValue(mockReturn);

      const result = await repository.saveHistoryTurn(mockData.action, mockData.gameId, mockData.playerId);
      expect(db.turnHistory.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(Either.right(mockReturn));
    });
  });

  describe('getHistoryTurnsByGameId', () => {
    test('should return history turns when found', async () => {
      const mockHistory = [{ id: 1, action: 'draw' }];
      db.turnHistory.findAll.mockResolvedValue(mockHistory);

      const result = await repository.getHistoryTurnsByGameId(1);
      expect(db.turnHistory.findAll).toHaveBeenCalledWith({ where: { gameId: 1 } });
      expect(result).toEqual(Either.right(mockHistory));
    });

    test('should return left if no history turns found', async () => {
      db.turnHistory.findAll.mockResolvedValue([]);

      const result = await repository.getHistoryTurnsByGameId(1);
      expect(db.turnHistory.findAll).toHaveBeenCalledWith({ where: { gameId: 1 } });
      expect(result).toEqual(Either.left("Not found history turns."));
    });
  });
});