import * as gameController from '../../controllers/gameController.js';
import * as gameService from '../../services/gameService.js';
import * as createCardAuto from '../../services/cardCreateAuto.js';
import * as matchController from '../../controllers/matchController.js';

jest.mock('../../services/gameService.js');
jest.mock('../../services/cardCreateAuto.js');
jest.mock('../../controllers/matchController.js');

describe('gameController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe('createGame', () => {
    test('should create game successfully and call saveCardsAuto', async () => {
      req = { body: { name: 'Game1', mode: 'classic' }, user: { playerId: 42 } };
      const createdGame = { game_id: 101, name: 'Game1' };

      gameService.createGame.mockResolvedValue(createdGame);
      createCardAuto.saveCardsAuto.mockResolvedValue();

      await gameController.createGame(req, res, next);

      expect(gameService.createGame).toHaveBeenCalledWith(req.body, 42);
      expect(createCardAuto.saveCardsAuto).toHaveBeenCalledWith(101);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdGame);
    });

    test('should return 400 if input validation fails', async () => {
      req = { body: { name: '', mode: 'classic' }, user: { playerId: 42 } };

      await gameController.createGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields must be completed' });
      expect(gameService.createGame).not.toHaveBeenCalled();
    });

    test('should call next on service error', async () => {
      req = { body: { name: 'Game1', mode: 'classic' }, user: { playerId: 42 } };
      gameService.createGame.mockRejectedValue(new Error('DB error'));

      await gameController.createGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getAllGames', () => {
    test('should return all games successfully', async () => {
      const games = [{ id: 1 }, { id: 2 }];
      gameService.getAllGames.mockResolvedValue(games);

      await gameController.getAllGames(req, res, next);

      expect(gameService.getAllGames).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(games);
    });

    test('should call next on error', async () => {
      gameService.getAllGames.mockRejectedValue(new Error('DB error'));

      await gameController.getAllGames(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getById', () => {
    test('should return game by id', async () => {
      req = { params: { id: '55' } };
      const game = { id: 55, name: 'My Game' };
      gameService.getById.mockResolvedValue(game);

      await gameController.getById(req, res, next);

      expect(gameService.getById).toHaveBeenCalledWith('55');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(game);
    });

    test('should call next on error', async () => {
      req = { params: { id: '55' } };
      gameService.getById.mockRejectedValue(new Error('DB error'));

      await gameController.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateAllGame', () => {
    test('should update game successfully', async () => {
      req = { params: { id: '101' }, body: { name: 'Updated Game', mode: 'hard' } };
      const updatedGame = { id: 101, name: 'Updated Game' };

      gameService.updateAllGame.mockResolvedValue(updatedGame);

      await gameController.updateAllGame(req, res, next);

      expect(gameService.updateAllGame).toHaveBeenCalledWith(req.body, '101');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedGame);
    });

    test('should return 400 if validation fails', async () => {
      req = { params: { id: '101' }, body: { name: '', mode: 'hard' } };

      await gameController.updateAllGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields must be completed' });
      expect(gameService.updateAllGame).not.toHaveBeenCalled();
    });

    test('should call next on error', async () => {
      req = { params: { id: '101' }, body: { name: 'Updated Game', mode: 'hard' } };
      gameService.updateAllGame.mockRejectedValue(new Error('DB error'));

      await gameController.updateAllGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteById', () => {
    test('should delete game successfully', async () => {
      req = { params: { id: '200' } };
      gameService.deleteById.mockResolvedValue();

      await gameController.deleteById(req, res, next);

      expect(gameService.deleteById).toHaveBeenCalledWith('200');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    test('should call next on error', async () => {
      req = { params: { id: '200' } };
      gameService.deleteById.mockRejectedValue(new Error('DB error'));

      await gameController.deleteById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('startGame', () => {
    test('should start game successfully and call matchController.startGame', async () => {
      req = { user: { playerId: 42 }, body: { idGame: '900' } };
      const response = { started: true };

      gameService.startGame.mockResolvedValue(response);
      matchController.startGame.mockImplementation(() => {});

      await gameController.startGame(req, res, next);

      expect(gameService.startGame).toHaveBeenCalledWith('900', 42);
      expect(matchController.startGame).toHaveBeenCalledWith('900', 42, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    test('should return 400 if idGame missing', async () => {
      req = { user: { playerId: 42 }, body: {} };

      await gameController.startGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game ID is required' });
      expect(gameService.startGame).not.toHaveBeenCalled();
    });

    test('should call next on error', async () => {
      req = { user: { playerId: 42 }, body: { idGame: '900' } };
      gameService.startGame.mockRejectedValue(new Error('DB error'));

      await gameController.startGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('endGame', () => {
    test('should end game successfully and call matchController.endedGame', async () => {
      req = { user: { playerId: 42 }, body: { idGame: '900' } };
      const response = { ended: true };

      gameService.endGame.mockResolvedValue(response);
      matchController.endedGame.mockImplementation(() => {});

      await gameController.endGame(req, res, next);

      expect(gameService.endGame).toHaveBeenCalledWith('900', 42);
      expect(matchController.endedGame).toHaveBeenCalledWith('900', 42, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    test('should return 400 if idGame missing', async () => {
      req = { user: { playerId: 42 }, body: {} };

      await gameController.endGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game ID is required' });
      expect(gameService.endGame).not.toHaveBeenCalled();
    });

    test('should call next on error', async () => {
      req = { user: { playerId: 42 }, body: { idGame: '900' } };
      gameService.endGame.mockRejectedValue(new Error('DB error'));

      await gameController.endGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getStatusGame', () => {
    test('should return 400 if idGame missing', async () => {
      req = { body: {} };

      await gameController.getStatusGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game ID is required' });
      expect(gameService.getStatusGame).not.toHaveBeenCalled();
    });

    test('should return status successfully', async () => {
      req = { body: { idGame: '777' } };
      const status = { state: 'active' };
      gameService.getStatusGame.mockResolvedValue(status);

      await gameController.getStatusGame(req, res, next);

      expect(gameService.getStatusGame).toHaveBeenCalledWith('777');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(status);
    });

    test('should call next on error', async () => {
      req = { body: { idGame: '777' } };
      gameService.getStatusGame.mockRejectedValue(new Error('DB error'));

      await gameController.getStatusGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('currentPlayer', () => {
    test('should return 400 if idGame missing', async () => {
      req = { body: {} };

      await gameController.currentPlayer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game ID is required' });
      expect(gameService.getCurrentPlayer).not.toHaveBeenCalled();
    });

    test('should return current player successfully', async () => {
      req = { body: { idGame: '999' } };
      const player = { playerId: 5 };
      gameService.getCurrentPlayer.mockResolvedValue(player);

      await gameController.currentPlayer(req, res, next);

      expect(gameService.getCurrentPlayer).toHaveBeenCalledWith('999');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(player);
    });

    test('should call next on error', async () => {
      req = { body: { idGame: '999' } };
      gameService.getCurrentPlayer.mockRejectedValue(new Error('DB error'));

      await gameController.currentPlayer(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
