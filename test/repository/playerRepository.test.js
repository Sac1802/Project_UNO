import { PlayerRepository } from '../../repository/playerRepository.js';
import db from '../../models/index.js';
import Either from '../../utils/Either.js';

jest.mock('../../models/index.js', () => ({
    player: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
        findOne: jest.fn(),
    }
}));

describe('PlayerRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new PlayerRepository();
    jest.clearAllMocks();
  });

  describe('savePlayer', () => {
    test('should create a new player', async () => {
      const mockData = { username: 'Malenia', score: 100 };
      const mockReturn = { id: 1, ...mockData };
      db.player.create.mockResolvedValue(mockReturn);

      const result = await repository.savePlayer(mockData);
      expect(db.player.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(Either.right(mockReturn));
    });
  });

  describe('getPlayers', () => {
    test('should return all players', async () => {
      const mockPlayers = [{ id: 1 }, { id: 2 }];
      db.player.findAll.mockResolvedValue(mockPlayers);

      const result = await repository.getPlayers();
      expect(db.player.findAll).toHaveBeenCalled();
      expect(result).toEqual(Either.right(mockPlayers));
    });
  });

  describe('getByIdPlayer', () => {
    test('should return a player by id', async () => {
      const mockPlayer = { id: 1, username: 'Malenia' };
      db.player.findByPk.mockResolvedValue(mockPlayer);

      const result = await repository.getByIdPlayer(1);
      expect(db.player.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(Either.right(mockPlayer));
    });
  });

  describe('updateFullPlayer', () => {
    test('should update a player', async () => {
      const mockPlayerInstance = { id: 1, username: 'Old', save: jest.fn() };
      db.player.findByPk.mockResolvedValue(mockPlayerInstance);
      mockPlayerInstance.save.mockResolvedValue(mockPlayerInstance);

      const newData = { username: 'New' };
      const result = await repository.updateFullPlayer(1, newData);

      expect(db.player.findByPk).toHaveBeenCalledWith(1);
      expect(mockPlayerInstance.save).toHaveBeenCalled();
      expect(result).toEqual(Either.right(mockPlayerInstance));
    });
  });

  describe('deletePlayer', () => {
    test('should delete a player by id', async () => {
      db.player.destroy.mockResolvedValue(1);
      const result = await repository.deletePlayer(1);

      expect(db.player.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(Either.right(1));
    });
  });

  describe('patchPlayer', () => {
    test('should patch a player', async () => {
      const mockPlayerInstance = { id: 1, username: 'Old', update: jest.fn() };
      db.player.findByPk.mockResolvedValue(mockPlayerInstance);
      mockPlayerInstance.update.mockResolvedValue(mockPlayerInstance);

      const patchData = { username: 'Patched' };
      const result = await repository.patchPlayer(patchData, 1);

      expect(db.player.findByPk).toHaveBeenCalledWith(1);
      expect(mockPlayerInstance.update).toHaveBeenCalledWith(patchData);
      expect(result).toEqual(Either.right(mockPlayerInstance));
    });
  });

  describe('findOne', () => {
    test('should find a player by username', async () => {
      const mockPlayer = { id: 1, username: 'Malenia' };
      db.player.findOne.mockResolvedValue(mockPlayer);

      const result = await repository.findOne('Malenia');
      expect(db.player.findOne).toHaveBeenCalledWith({ where: { username: 'Malenia' } });
      expect(result).toEqual(Either.right(mockPlayer));
    });
  });
});