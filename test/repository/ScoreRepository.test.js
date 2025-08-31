import { ScoreRepository } from '../../repository/ScoreRepository.js';
import score from '../../models/score.js';
import Either from '../../utils/Either.js';

jest.mock('../../models/score.js');

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
      score.create.mockResolvedValue(mockReturn);

      const result = await repository.saveScore(mockData);
      expect(score.create).toHaveBeenCalledWith(mockData);
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual(mockReturn);
    });
  });

  describe('getAllScore', () => {
    test('should return all scores', async () => {
      const mockScores = [{ id: 1 }, { id: 2 }];
      score.findAll.mockResolvedValue(mockScores);

      const result = await repository.getAllScore();
      expect(score.findAll).toHaveBeenCalledWith({});
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual(mockScores);
    });
  });

  describe('getById', () => {
    test('should return a score by id', async () => {
      const mockScore = { id: 1, player: 'Alice' };
      score.findByPk.mockResolvedValue(mockScore);

      const result = await repository.getById(1);
      expect(score.findByPk).toHaveBeenCalledWith(1);
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toEqual(mockScore);
    });
  });

  describe('updateAll', () => {
    test('should update a score', async () => {
      const mockScoreInstance = { id: 1, points: 50, save: jest.fn().mockResolvedValue(true) };
      score.findByPk.mockResolvedValue(mockScoreInstance);

      const newData = { points: 150 };
      const result = await repository.updateAll(newData, 1);

      expect(score.findByPk).toHaveBeenCalledWith(1);
      expect(mockScoreInstance.save).toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
    });
  });

  describe('deleteById', () => {
    test('should delete a score by id', async () => {
      score.destroy.mockResolvedValue(1);
      const result = await repository.deleteById(1);

      expect(score.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result.isRight()).toBe(true);
      expect(result.getOrElse()).toBe(1);
    });
  });

  describe('patchScore', () => {
    test('should patch a score', async () => {
      const mockScoreInstance = { id: 1, points: 50, update: jest.fn().mockResolvedValue(true) };
      score.findByPk.mockResolvedValue(mockScoreInstance);

      const patchData = { points: 200 };
      const result = await repository.patchScore(patchData, 1);

      expect(score.findByPk).toHaveBeenCalledWith(1);
      expect(mockScoreInstance.update).toHaveBeenCalledWith(patchData);
      expect(result.isRight()).toBe(true);
    });
  });
});
