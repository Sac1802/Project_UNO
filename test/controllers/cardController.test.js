import * as cardController from '../../controllers/cardController.js';
import * as cardService from '../../services/cardService.js';

jest.mock('../../services/cardService.js');

describe('cardController', () => {
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

  describe('createCard', () => {
    test('should create card successfully', async () => {
      req = { body: { title: 'Test Card', description: 'Test Description' } };
      cardService.createCard.mockResolvedValue({ id: 1, ...req.body });

      await cardController.createCard(req, res, next);

      expect(cardService.createCard).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
    });

    test('should return 400 if validation fails', async () => {
      req = { body: { title: '', description: 'Test Description' } };

      await cardController.createCard(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields must be completed' });
      expect(cardService.createCard).not.toHaveBeenCalled();
    });

    test('should call next with error if service throws', async () => {
      req = { body: { title: 'Test Card', description: 'Test Description' } };
      cardService.createCard.mockRejectedValue(new Error('DB error'));

      await cardController.createCard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getAllCards', () => {
    test('should return all cards successfully', async () => {
      req = {};
      const cards = [{ id: 1 }, { id: 2 }];
      cardService.getAllCards.mockResolvedValue(cards);

      await cardController.getAllCards(req, res, next);

      expect(cardService.getAllCards).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(cards);
    });

    test('should call next with error if service throws', async () => {
      req = {};
      cardService.getAllCards.mockRejectedValue(new Error('DB error'));

      await cardController.getAllCards(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getByIdCard', () => {
    test('should return card by id', async () => {
      req = { params: { id: '1' } };
      const card = { id: 1, title: 'Test Card' };
      cardService.getByIdCard.mockResolvedValue(card);

      await cardController.getByIdCard(req, res, next);

      expect(cardService.getByIdCard).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(card);
    });

    test('should call next with error if service throws', async () => {
      req = { params: { id: '1' } };
      cardService.getByIdCard.mockRejectedValue(new Error('DB error'));

      await cardController.getByIdCard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateAllCard', () => {
    test('should update card successfully', async () => {
      req = { params: { id: '1' }, body: { title: 'Updated', description: 'Updated Desc' } };
      cardService.updateAll.mockResolvedValue({ id: 1, ...req.body });

      await cardController.updateAllCard(req, res, next);

      expect(cardService.updateAll).toHaveBeenCalledWith(req.body, '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
    });

    test('should return 400 if validation fails', async () => {
      req = { params: { id: '1' }, body: { title: '', description: 'Updated Desc' } };

      await cardController.updateAllCard(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields must be completed' });
      expect(cardService.updateAll).not.toHaveBeenCalled();
    });

    test('should call next with error if service throws', async () => {
      req = { params: { id: '1' }, body: { title: 'Updated', description: 'Updated Desc' } };
      cardService.updateAll.mockRejectedValue(new Error('DB error'));

      await cardController.updateAllCard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteById', () => {
    test('should delete card successfully', async () => {
      req = { params: { id: '1' } };
      cardService.deleteById.mockResolvedValue();

      await cardController.deleteById(req, res, next);

      expect(cardService.deleteById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    test('should call next with error if service throws', async () => {
      req = { params: { id: '1' } };
      cardService.deleteById.mockRejectedValue(new Error('DB error'));

      await cardController.deleteById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('patchCard', () => {
    test('should patch card successfully', async () => {
      req = { params: { id: '1' }, body: { title: 'Patched' } };
      cardService.patchCard.mockResolvedValue({ id: 1, title: 'Patched' });

      await cardController.patchCard(req, res, next);

      expect(cardService.patchCard).toHaveBeenCalledWith(req.body, '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, title: 'Patched' });
    });

    test('should call next with error if service throws', async () => {
      req = { params: { id: '1' }, body: { title: 'Patched' } };
      cardService.patchCard.mockRejectedValue(new Error('DB error'));

      await cardController.patchCard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getTopCard', () => {
    test('should return 400 if idGame missing', async () => {
      req = { body: {} };

      await cardController.getTopCard(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game ID is required' });
      expect(cardService.getTopCrad).not.toHaveBeenCalled();
    });

    test('should get top card successfully', async () => {
      req = { body: { idGame: '123' } };
      const topCard = { id: 1, value: '9' };
      cardService.getTopCrad = jest.fn().mockResolvedValue(topCard);

      await cardController.getTopCard(req, res, next);

      expect(cardService.getTopCrad).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(topCard);
    });

    test('should call next with error if service throws', async () => {
      req = { body: { idGame: '123' } };
      cardService.getTopCrad = jest.fn().mockRejectedValue(new Error('DB error'));

      await cardController.getTopCard(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
