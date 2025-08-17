import { PlayerRepository } from '../../repository/playerRepository.js';
import player from '../../models/player.js';

jest.mock('../../models/player.js');

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
      player.create.mockResolvedValue(mockReturn);

      const result = await repository.savePlayer(mockData);
      expect(player.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockReturn);
    });
  });

  describe('getPlayers', () => {
    test('should return all players', async () => {
      const mockPlayers = [{ id: 1 }, { id: 2 }];
      player.findAll.mockResolvedValue(mockPlayers);

      const result = await repository.getPlayers();
      expect(player.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPlayers);
    });
  });

  describe('getByIdPlayer', () => {
    test('should return a player by id', async () => {
      const mockPlayer = { id: 1, username: 'Malenia' };
      player.findByPk.mockResolvedValue(mockPlayer);

      const result = await repository.getByIdPlayer(1);
      expect(player.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPlayer);
    });
  });

  describe('updateFullPlayer', () => {
    test('should update a player', async () => {
      const mockPlayerInstance = { id: 1, username: 'Old', save: jest.fn().mockResolvedValue(true) };
      repository.getByIdPlayer = jest.fn().mockResolvedValue(mockPlayerInstance);

      const newData = { username: 'New' };
      const result = await repository.updateFullPlayer(1, newData);

      expect(repository.getByIdPlayer).toHaveBeenCalledWith(1);
      expect(mockPlayerInstance.save).toHaveBeenCalled();
      expect(mockPlayerInstance.username).toBe('New');
      expect(result).toBe(true);
    });
  });

  describe('deletePlayer', () => {
    test('should delete a player by id', async () => {
      player.destroy.mockResolvedValue(1);
      const result = await repository.deletePlayer(1);

      expect(player.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });
  });

  describe('patchPlayer', () => {
    test('should patch a player', async () => {
      const mockPlayerInstance = { id: 1, username: 'Old', update: jest.fn().mockResolvedValue(true) };
      repository.getByIdPlayer = jest.fn().mockResolvedValue(mockPlayerInstance);

      const patchData = { username: 'Patched' };
      const result = await repository.patchPlayer(patchData, 1);

      expect(repository.getByIdPlayer).toHaveBeenCalledWith(1);
      expect(mockPlayerInstance.update).toHaveBeenCalledWith(patchData);
      expect(result).toBe(true);
    });
  });

  describe('findOne', () => {
    test('should find a player by username', async () => {
      const mockPlayer = { id: 1, username: 'Malenia' };
      player.findOne.mockResolvedValue(mockPlayer);

      const result = await repository.findOne('Malenia');
      expect(player.findOne).toHaveBeenCalledWith({ where: { username: 'Malenia' } });
      expect(result).toEqual(mockPlayer);
    });
  });
});
