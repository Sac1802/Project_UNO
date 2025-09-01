import { GameRepository } from '../../repository/gameRepository.js';
import game from '../../models/games.js';
import gameFast from '../../models/gameFast.js';
import Either from '../../utils/Either.js';

jest.mock('../../models/games.js');
jest.mock('../../models/gameFast.js');

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
      game.create.mockResolvedValue(mockReturn);

      const result = await repository.createGame(mockData);
      expect(game.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockReturn);
    });
  });

  describe('getAllGames', () => {
    test('should return all games', async () => {
      const mockGames = [{ id: 1 }, { id: 2 }];
      game.findAll.mockResolvedValue(mockGames);

      const result = await repository.getAllGames();
      expect(game.findAll).toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual(mockGames);
    });
  });

  describe('getById', () => {
    test('should return a game by id', async () => {
      const mockGame = { id: 1, name: 'Game1' };
      game.findByPk.mockResolvedValue(mockGame);

      const result = await repository.getById(1);
      expect(game.findByPk).toHaveBeenCalledWith(1);
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual(mockGame);
    });
  });

  describe('updateAllGame', () => {
    test('should update a game', async () => {
      const mockGameInstance = { id: 1, name: 'Old', save: jest.fn().mockResolvedValue(true) };
      game.findByPk.mockResolvedValue(mockGameInstance);

      const newData = { name: 'New' };
      const result = await repository.updateAllGame(newData, 1);

      expect(game.findByPk).toHaveBeenCalledWith(1);
      expect(mockGameInstance.save).toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
    });
  });

  describe('deleteById', () => {
    test('should delete a game by id', async () => {
      game.destroy.mockResolvedValue(1);
      const result = await repository.deleteById(1);

      expect(game.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toBe("Game deleted successfully");
    });
  });

  describe('patchGame', () => {
    test('should patch a game', async () => {
      const mockGameInstance = { id: 1, name: 'Old', update: jest.fn().mockResolvedValue(true) };
      game.findByPk.mockResolvedValue(mockGameInstance);

      const patchData = { name: 'Patched' };
      const result = await repository.patchGame(patchData, 1);

      expect(game.findByPk).toHaveBeenCalledWith(1);
      expect(mockGameInstance.update).toHaveBeenCalledWith(patchData);
      expect(result.isRight()).toBe(true);
    });
  });

  describe('gameFast', () => {
    test('should create a fast game', async () => {
      const mockData = { mode: 'fast' };
      const mockReturn = { id: 1, ...mockData };
      gameFast.create.mockResolvedValue(mockReturn);

      const result = await repository.gameFast(mockData);
      expect(gameFast.create).toHaveBeenCalledWith(mockData);
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual(mockReturn);
    });
  });

  describe('startGame', () => {
    test('should start a game', async () => {
      const mockGameInstance = { id: 1, save: jest.fn().mockResolvedValue(true) };
      game.findByPk.mockResolvedValue(mockGameInstance);

      const data = { status: 'started' };
      const result = await repository.startGame(data, 1);

      expect(game.findByPk).toHaveBeenCalledWith(1);
      expect(mockGameInstance.save).toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
    });
  });

  describe('endGame', () => {
    test('should end a game', async () => {
      const mockGameInstance = { id: 1, save: jest.fn().mockResolvedValue(true) };
      game.findByPk.mockResolvedValue(mockGameInstance);

      const data = { status: 'ended' };
      const result = await repository.endGame(data, 1);

      expect(game.findByPk).toHaveBeenCalledWith(1);
      expect(mockGameInstance.save).toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
    });
  });

  describe('getCurrentPlayer', () => {
    test('should return the current player id', async () => {
      const mockGameInstance = { current_turn_player_id: 42 };
      game.findByPk.mockResolvedValue(mockGameInstance);

      const result = await repository.getCurrentPlayer(1);
      expect(game.findByPk).toHaveBeenCalledWith(1);
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toBe(42);
    });
  });

  describe('startGameWithTimeLimit', () => {
    test('should start a game with time limit', async () => {
      const mockGameInstance = { id: 1, save: jest.fn().mockResolvedValue(true) };
      game.findByPk.mockResolvedValue(mockGameInstance);

      const data = { status: 'started', timeLimit: 60 };
      const result = await repository.startGameWithTimeLimit(data, 1);

      expect(game.findByPk).toHaveBeenCalledWith(1);
      expect(mockGameInstance.save).toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
    });
  });
});
