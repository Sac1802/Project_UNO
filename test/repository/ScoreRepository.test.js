import { ScoreRepository } from '../../repository/ScoreRepository.js';
import db from '../../models/index.js';
import Either from '../../utils/Either.js';

jest.mock('../../models/index.js', () => ({
    score: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
    }
}));

describe('ScoreRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new ScoreRepository();
    jest.clearAllMocks();
  });

  describe('saveScore', () => {
    test('should create a new score', async () => {
      const mockData = { player: 'Alice', points: 100 };
      const mockReturn = { id: 1, ...mockData };
      db.score.create.mockResolvedValue(mockReturn);

      const result = await repository.saveScore(mockData);
      expect(db.score.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(Either.right(mockReturn));
    });
  });

  describe('getAllScore', () => {
    test('should return all scores', async () => {
      const mockScores = [{ id: 1 }, { id: 2 }];
      db.score.findAll.mockResolvedValue(mockScores);

      const result = await repository.getAllScore();
      expect(db.score.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(Either.right(mockScores));
    });
  });

  describe('getById', () => {
    test('should return a score by id', async () => {
      const mockScore = { id: 1, player: 'Alice' };
      db.score.findByPk.mockResolvedValue(mockScore);

      const result = await repository.getById(1);
      expect(db.score.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(Either.right(mockScore));
    });
  });

  describe('updateAll', () => {
    test('should update a score', async () => {
      const mockScoreInstance = { id: 1, points: 50, save: jest.fn() };
      db.score.findByPk.mockResolvedValue(mockScoreInstance);
      mockScoreInstance.save.mockResolvedValue(mockScoreInstance);

      const newData = { points: 150 };
      const result = await repository.updateAll(newData, 1);

      expect(db.score.findByPk).toHaveBeenCalledWith(1);
      expect(mockScoreInstance.save).toHaveBeenCalled();
      expect(result).toEqual(Either.right(mockScoreInstance));
    });
  });

  describe('deleteById', () => {
    test('should delete a score by id', async () => {
      db.score.destroy.mockResolvedValue(1);
      const result = await repository.deleteById(1);

      expect(db.score.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(Either.right(1));
    });
  });

  describe('patchScore', () => {
    test('should patch a score', async () => {
      const mockScoreInstance = { id: 1, points: 50, update: jest.fn() };
      db.score.findByPk.mockResolvedValue(mockScoreInstance);
      mockScoreInstance.update.mockResolvedValue(mockScoreInstance);

      const patchData = { points: 200 };
      const result = await repository.patchScore(patchData, 1);

      expect(db.score.findByPk).toHaveBeenCalledWith(1);
      expect(mockScoreInstance.update).toHaveBeenCalledWith(patchData);
      expect(result).toEqual(Either.right(mockScoreInstance));
    });
  });
});