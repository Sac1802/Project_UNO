import { GameRepository } from '../../repository/gameRepository.js';
import db from '../../models/index.js';
import Either from '../../utils/Either.js';

jest.mock('../../models/index.js', () => ({
    game: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
    },
    gameFast: {
        create: jest.fn(),
    }
}));

describe('GameRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new GameRepository();
    jest.clearAllMocks();
  });

  describe('createGame', () => {
    test('should create a new game', async () => {
      const mockData = { name: 'Game1' };
      const mockReturn = { id: 1, ...mockData };
      db.game.create.mockResolvedValue(mockReturn);

      const result = await repository.createGame(mockData);
      expect(db.game.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(Either.right(mockReturn));
    });
  });

  describe('getAllGames', () => {
    test('should return all games', async () => {
      const mockGames = [{ id: 1 }, { id: 2 }];
      db.game.findAll.mockResolvedValue(mockGames);

      const result = await repository.getAllGames();
      expect(db.game.findAll).toHaveBeenCalled();
      expect(result).toEqual(Either.right(mockGames));
    });
  });

  describe('getById', () => {
    test('should return a game by id', async () => {
      const mockGame = { id: 1, name: 'Game1' };
      db.game.findByPk.mockResolvedValue(mockGame);

      const result = await repository.getById(1);
      expect(db.game.findByPk).toHaveBeenCalledWith(1, {});
      expect(result).toEqual(Either.right(mockGame));
    });
  });

  describe('updateAllGame', () => {
    test('should update a game', async () => {
      const mockGameInstance = { id: 1, name: 'Old', save: jest.fn().mockResolvedValue(true) };
      db.game.findByPk.mockResolvedValue(mockGameInstance);
      mockGameInstance.save.mockResolvedValue(mockGameInstance);

      const newData = { name: 'New' };
      const result = await repository.updateAllGame(newData, 1);

      expect(db.game.findByPk).toHaveBeenCalledWith(1, {});
      expect(mockGameInstance.save).toHaveBeenCalled();
      expect(result).toEqual(Either.right(mockGameInstance));
    });
  });

  describe('deleteById', () => {
    test('should delete a game by id', async () => {
      db.game.destroy.mockResolvedValue(1);
      const result = await repository.deleteById(1);

      expect(db.game.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(Either.right("Game deleted successfully"));
    });
  });

  describe('patchGame', () => {
    test('should patch a game', async () => {
      const mockGameInstance = { id: 1, name: 'Old', update: jest.fn().mockResolvedValue(true) };
      db.game.findByPk.mockResolvedValue(mockGameInstance);
      mockGameInstance.update.mockResolvedValue(mockGameInstance);

      const patchData = { name: 'Patched' };
      const result = await repository.patchGame(patchData, 1);

      expect(db.game.findByPk).toHaveBeenCalledWith(1, {});
      expect(mockGameInstance.update).toHaveBeenCalledWith(patchData);
      expect(result).toEqual(Either.right(mockGameInstance));
    });
  });

  describe('gameFast', () => {
    test('should create a fast game', async () => {
      const mockData = { mode: 'fast' };
      const mockReturn = { id: 1, ...mockData };
      db.gameFast.create.mockResolvedValue(mockReturn);

      const result = await repository.gameFast(mockData);
      expect(db.gameFast.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(Either.right(mockReturn));
    });
  });

  describe('startGame', () => {
    test('should start a game', async () => {
      const mockGameInstance = { id: 1, save: jest.fn().mockResolvedValue(true) };
      db.game.findByPk.mockResolvedValue(mockGameInstance);
      mockGameInstance.save.mockResolvedValue(mockGameInstance);

      const data = { status: 'started' };
      const result = await repository.startGame(data, 1);

      expect(db.game.findByPk).toHaveBeenCalledWith(1, {});
      expect(mockGameInstance.save).toHaveBeenCalled();
      expect(result).toEqual(Either.right("Game started successfully"));
    });
  });

  describe('endGame', () => {
    test('should end a game', async () => {
      const mockGameInstance = { id: 1, save: jest.fn().mockResolvedValue(true) };
      db.game.findByPk.mockResolvedValue(mockGameInstance);
      mockGameInstance.save.mockResolvedValue(mockGameInstance);

      const data = { status: 'ended' };
      const result = await repository.endGame(data, 1);

      expect(db.game.findByPk).toHaveBeenCalledWith(1, {});
      expect(mockGameInstance.save).toHaveBeenCalled();
      expect(result).toEqual(Either.right("Game ended successfully"));
    });
  });

  describe('getCurrentPlayer', () => {
    test('should return the current player id', async () => {
      const mockGameInstance = { current_turn_player_id: 42 };
      db.game.findByPk.mockResolvedValue(mockGameInstance);

      const result = await repository.getCurrentPlayer(1);
      expect(db.game.findByPk).toHaveBeenCalledWith(1, {});
      expect(result).toEqual(Either.right(mockGameInstance.current_turn_player_id));
    });
  });

  describe('startGameWithTimeLimit', () => {
    test('should start a game with time limit', async () => {
      const mockGameInstance = { id: 1, save: jest.fn().mockResolvedValue(true) };
      db.game.findByPk.mockResolvedValue(mockGameInstance);
      mockGameInstance.save.mockResolvedValue(mockGameInstance);

      const data = { status: 'started', timeLimit: 60 };
      const result = await repository.startGameWithTimeLimit(data, 1);

      expect(db.game.findByPk).toHaveBeenCalledWith(1, {});
      expect(mockGameInstance.save).toHaveBeenCalled();
      expect(result).toEqual(Either.right(mockGameInstance));
    });
  });
});