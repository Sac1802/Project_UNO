import * as matchController from '../../controllers/matchController.js';
import * as matchService from '../../services/matchService.js';

jest.mock('../../services/matchService.js');

describe('matchController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('saveMatch', () => {
    test('should return 400 if idGame missing', async () => {
      req = { user: { playerId: 1 }, body: {} };

      await matchController.saveMatch(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game ID is required' });
      expect(matchService.saveUserMatch).not.toHaveBeenCalled();
    });

    test('should save match successfully', async () => {
      req = { user: { playerId: 1 }, body: { idGame: '100' } };
      const response = { success: true };
      matchService.saveUserMatch.mockResolvedValue(response);

      await matchController.saveMatch(req, res, next);

      expect(matchService.saveUserMatch).toHaveBeenCalledWith('100', 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    test('should call next on service error', async () => {
      req = { user: { playerId: 1 }, body: { idGame: '100' } };
      matchService.saveUserMatch.mockRejectedValue(new Error('DB error'));

      await matchController.saveMatch(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('changeStatusUser', () => {
    test('should return 400 if idGame missing', async () => {
      req = { user: { playerId: 2 }, body: {} };

      await matchController.changeStatusUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game ID is required' });
      expect(matchService.changeStatus).not.toHaveBeenCalled();
    });

    test('should change status successfully', async () => {
      req = { user: { playerId: 2 }, body: { idGame: '101' } };
      const response = { statusChanged: true };
      matchService.changeStatus.mockResolvedValue(response);

      await matchController.changeStatusUser(req, res, next);

      expect(matchService.changeStatus).toHaveBeenCalledWith('101', 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    test('should call next on error', async () => {
      req = { user: { playerId: 2 }, body: { idGame: '101' } };
      matchService.changeStatus.mockRejectedValue(new Error('Error'));

      await matchController.changeStatusUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('startGame', () => {

    test('should call service and next on error', async () => {
      const nextSpy = jest.fn();
      matchService.changeStatusInGame.mockRejectedValue(new Error('Error'));

      await matchController.startGame('123', 1, nextSpy);

      expect(matchService.changeStatusInGame).toHaveBeenCalledWith('123', 1);
      expect(nextSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    test('should call service without error', async () => {
      const nextSpy = jest.fn();
      matchService.changeStatusInGame.mockResolvedValue();

      await matchController.startGame('123', 1, nextSpy);

      expect(matchService.changeStatusInGame).toHaveBeenCalledWith('123', 1);
      expect(nextSpy).not.toHaveBeenCalled();
    });
  });

  describe('abandonmentGame', () => {
    test('should return 400 if idGame missing', async () => {
      req = { user: { playerId: 3 }, body: {} };

      await matchController.abandonmentGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game ID is required' });
      expect(matchService.abandonmentGame).not.toHaveBeenCalled();
    });

    test('should call abandonmentGame successfully', async () => {
      req = { user: { playerId: 3 }, body: { idGame: '555' } };
      const response = { abandoned: true };
      matchService.abandonmentGame.mockResolvedValue(response);

      await matchController.abandonmentGame(req, res, next);

      expect(matchService.abandonmentGame).toHaveBeenCalledWith('555', 3);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    test('should call next on error', async () => {
      req = { user: { playerId: 3 }, body: { idGame: '555' } };
      matchService.abandonmentGame.mockRejectedValue(new Error('Error'));

      await matchController.abandonmentGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('endedGame', () => {
    test('should not call next when successful', async () => {
      const nextSpy = jest.fn();
      matchService.endGame.mockResolvedValue();

      await matchController.endedGame('789', 7, nextSpy);

      expect(matchService.endGame).toHaveBeenCalledWith('789', 7);
      expect(nextSpy).not.toHaveBeenCalled();
    });

    test('should call next on error', async () => {
      const nextSpy = jest.fn();
      matchService.endGame.mockRejectedValue(new Error('Error'));

      await matchController.endedGame('789', 7, nextSpy);

      expect(nextSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getPlayerInGame', () => {
    test('should return 400 if idGame missing', async () => {
      req = { body: {} };

      await matchController.getPlayerInGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game ID is required' });
      expect(matchService.getPlayers).not.toHaveBeenCalled();
    });

    test('should return players successfully', async () => {
      req = { body: { idGame: '321' } };
      const players = [{ playerId: 1 }, { playerId: 2 }];
      matchService.getPlayers.mockResolvedValue(players);

      await matchController.getPlayerInGame(req, res, next);

      expect(matchService.getPlayers).toHaveBeenCalledWith('321');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(players);
    });

    test('should call next on error', async () => {
      req = { body: { idGame: '321' } };
      matchService.getPlayers.mockRejectedValue(new Error('DB error'));

      await matchController.getPlayerInGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
