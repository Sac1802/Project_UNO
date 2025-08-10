// test/controllers/scoreController.test.js
import * as scoreService from '../../services/scoreService.js';
import * as scoreController from '../../controllers/scoreController.js';

jest.mock('../../services/scoreService.js');

describe('scoreController', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('saveScore', () => {
    it('should return 400 if validation fails', async () => {
      req.body = { points: '' }; // campo vacío
      await scoreController.saveScore(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields must be completed' });
    });

    it('should return 201 if score saved successfully', async () => {
      req.body = { points: 100, playerId: '123' };
      scoreService.saveScore.mockResolvedValue({ id: 1 });
      await scoreController.saveScore(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('getAllScore', () => {
    it('should return 200 with scores', async () => {
      scoreService.getAllScore.mockResolvedValue([{ id: 1 }]);
      await scoreController.getAllScore(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });
  });

  describe('getById', () => {
    it('should return 200 with score by id', async () => {
      req.params.id = '1';
      scoreService.getById.mockResolvedValue({ id: 1 });
      await scoreController.getById(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('updateAllScore', () => {
    it('should return 400 if validation fails', async () => {
      req.body = { points: '' };
      await scoreController.updateAllScore(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields must be completed' });
    });

    it('should return 200 if score updated', async () => {
      req.body = { points: 200, playerId: '123' };
      req.params.id = '1';
      scoreService.updateAll.mockResolvedValue({ id: 1 });
      await scoreController.updateAllScore(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('deleteById', () => {
    it('should return 204 on success', async () => {
      req.params.id = '1';
      await scoreController.deleteById(req, res, next);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('patchScore', () => {
    it('should return 200 when patched', async () => {
      req.body = { points: 50 };
      req.params.id = '1';
      scoreService.patchScore.mockResolvedValue({ id: 1 });
      await scoreController.patchScore(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('getScoreAllPlayer', () => {
    it('should return 400 if idGame is missing', async () => {
      req.body = {};
      await scoreController.getScoreAllPlayer(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game ID is required' });
    });

    it('should return 200 with scores for all players', async () => {
      req.body = { idGame: 'game1' };
      scoreService.scoreAllPlayers.mockResolvedValue([{ playerId: 1, points: 10 }]);
      await scoreController.getScoreAllPlayer(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ playerId: 1, points: 10 }]);
    });
  });
});
