jest.mock('../../models/match.js', () => ({
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
}));

jest.mock('../../models/player.js', () => ({}));

import { MatchRepository } from '../../repository/matchRepository.js';
import match from '../../models/match.js';
import Either from '../../utils/Either.js';
import player from '../../models/player.js';

describe('MatchRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new MatchRepository();
    jest.clearAllMocks();
  });

  describe('saveUserMatch', () => {
    test('should create a new match', async () => {
      const mockData = { id_game: 1, id_player: 1 };
      const mockReturn = { id: 1, ...mockData };
      match.create.mockResolvedValue(mockReturn);

      const result = await repository.saveUserMatch(mockData);
      expect(match.create).toHaveBeenCalledWith(mockData);
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual(mockReturn);
    });
  });

  describe('changeStatus', () => {
    test('should update the status for a specific player', async () => {
      const newData = { status: 'active' };
      match.update.mockResolvedValue([1]);

      const result = await repository.changeStatus(newData, 1, 2);
      expect(match.update).toHaveBeenCalledWith(newData, {
        where: { id_game: 1, id_player: 2 },
      });
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual([1]);
    });
  });

  describe('changeStatusAllPlayers', () => {
    test('should update status for all players in a game', async () => {
      const newData = { status: 'finished' };
      match.update.mockResolvedValue([3]);

      const result = await repository.changeStatusAllPlayers(newData, 1);
      expect(match.update).toHaveBeenCalledWith(newData, {
        where: { id_game: 1 },
      });
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual([3]);
    });
  });

  describe('getPlayers', () => {
    test('should return all players for a game', async () => {
      const mockPlayers = [{ id: 1, player: { username: 'Alice' } }];
      match.findAll.mockResolvedValue(mockPlayers);

      const result = await repository.getPlayers(1);
      expect(match.findAll).toHaveBeenCalledWith({
        where: { id_game: 1 },
        include: {
          model: player,
          attributes: ['username'],
        },
      });
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual(mockPlayers);
    });
  });

  describe('findOne', () => {
    test('should return a specific match', async () => {
      const mockMatch = { id: 1, id_game: 1, id_player: 2 };
      match.findOne.mockResolvedValue(mockMatch);

      const result = await repository.findOne(1, 2);
      expect(match.findOne).toHaveBeenCalledWith({
        where: { id_game: 1, id_player: 2 },
      });
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual(mockMatch);
    });
  });

  describe('count', () => {
    test('should return the number of matches in a game', async () => {
      match.count.mockResolvedValue(5);

      const result = await repository.count(1);
      expect(match.count).toHaveBeenCalledWith({
        where: { id_game: 1 },
      });
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toBe(5);
    });
  });

  describe('listUser', () => {
    test('should list all matches for a game', async () => {
      const mockMatches = [{ id: 1 }, { id: 2 }];
      match.findAll.mockResolvedValue(mockMatches);

      const result = await repository.listUser(1);
      expect(match.findAll).toHaveBeenCalledWith({
        where: { id_game: 1 },
      });
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual(mockMatches);
    });
  });
});
