import * as cardController from '../../controllers/cardController.js';
import { CardsService } from '../../services/cardService.js';
import Either from '../../utils/Either.js';

const mockServiceInstance = {
  createCard: jest.fn(),
  getAllCards: jest.fn(),
  getByIdCard: jest.fn(),
  updateAll: jest.fn(),
  deleteById: jest.fn(),
  patchCard: jest.fn(),
  getTopCard: jest.fn(),
};

jest.mock('../../services/cardService.js', () => ({
  CardsService: jest.fn().mockImplementation(() => ({
    createCard: jest.fn(),
    getAllCards: jest.fn(),
    getByIdCard: jest.fn(),
    updateAll: jest.fn(),
    deleteById: jest.fn(),
    patchCard: jest.fn(),
    getTopCard: jest.fn(),
  }))
}));

jest.mock('../../repository/CardRepository.js', () => ({
  CardRepository: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../models/cards.js', () => ({
  default: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    belongsTo: jest.fn(),
  }
}));

jest.mock('../../models/games.js', () => ({
  default: {
    hasMany: jest.fn(),
  }
}));

jest.mock('../../db/db.js', () => ({
  default: {
    define: jest.fn(),
  }
}));

describe('cardController', () => {
  let req, res, next;
  let mockedCardsService;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
    
    mockedCardsService = jest.mocked(CardsService);
    mockedCardsService.mockImplementation(() => mockServiceInstance);
  });

  describe('createCard', () => {
    test('should create card successfully', async () => {
      req = { body: { title: 'Test Card', description: 'Test Description' } };
      const cardData = { id: 1, ...req.body };
      mockServiceInstance.createCard.mockResolvedValue(Either.right(cardData));

      await cardController.createCard(req, res, next);

      expect(mockServiceInstance.createCard).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(cardData);
    });

    test('should return 400 if validation fails', async () => {
      req = { body: { title: '', description: 'Test Description' } };

      await cardController.createCard(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields must be completed' });
      expect(mockServiceInstance.createCard).not.toHaveBeenCalled();
    });

    test('should return error if service returns left', async () => {
      req = { body: { title: 'Test Card', description: 'Test Description' } };
      const error = { message: 'DB error', statusCode: 500 };
      mockServiceInstance.createCard.mockResolvedValue(Either.left(error));

      await cardController.createCard(req, res, next);

      expect(mockServiceInstance.createCard).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('getAllCards', () => {
    test('should return all cards successfully', async () => {
      req = {};
      const cards = [{ id: 1 }, { id: 2 }];
      mockServiceInstance.getAllCards.mockResolvedValue(Either.right(cards));

      await cardController.getAllCards(req, res, next);

      expect(mockServiceInstance.getAllCards).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(cards);
    });

    test('should return error if repository returns left', async () => {
      req = {};
      const error = { message: 'DB error', statusCode: 500 };
      mockServiceInstance.getAllCards.mockResolvedValue(Either.left(error));

      await cardController.getAllCards(req, res, next);

      expect(mockServiceInstance.getAllCards).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });
  });

  describe('getByIdCard', () => {
    test('should return card by id', async () => {
      req = { params: { id: '1' } };
      const card = { id: 1, title: 'Test Card' };
      mockServiceInstance.getByIdCard.mockResolvedValue(Either.right(card));

      await cardController.getByIdCard(req, res, next);

      expect(mockServiceInstance.getByIdCard).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(card);
    });

    test('should return error if repository returns left', async () => {
      req = { params: { id: '1' } };
      const error = { message: 'Card not found', statusCode: 404 };
      mockServiceInstance.getByIdCard.mockResolvedValue(Either.left(error));

      await cardController.getByIdCard(req, res, next);

      expect(mockServiceInstance.getByIdCard).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Card not found' });
    });
  });

  describe('updateAllCard', () => {
    test('should update card successfully', async () => {
      req = { params: { id: '1' }, body: { title: 'Updated', description: 'Updated Desc' } };
      const updatedCard = { id: 1, ...req.body };
      
      mockServiceInstance.updateAll.mockResolvedValue(Either.right(updatedCard));

      await cardController.updateAllCard(req, res, next);

      expect(mockServiceInstance.updateAll).toHaveBeenCalledWith(req.body, '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedCard);
    });

    test('should return 400 if validation fails', async () => {
      req = { params: { id: '1' }, body: { title: '', description: 'Updated Desc' } };

      await cardController.updateAllCard(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields must be completed' });
      expect(mockServiceInstance.updateAll).not.toHaveBeenCalled();
    });

    test('should return error if service returns left', async () => {
      req = { params: { id: '1' }, body: { title: 'Updated', description: 'Updated Desc' } };
      const error = { message: 'Card not found', statusCode: 404 };
      
      mockServiceInstance.updateAll.mockResolvedValue(Either.left(error));

      await cardController.updateAllCard(req, res, next);

      expect(mockServiceInstance.updateAll).toHaveBeenCalledWith(req.body, '1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Card not found' });
    });
  });

  describe('deleteById', () => {
    test('should delete card successfully', async () => {
      req = { params: { id: '1' } };
      
      mockServiceInstance.deleteById.mockResolvedValue(Either.right(null));

      await cardController.deleteById(req, res, next);

      expect(mockServiceInstance.deleteById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    test('should return error if service returns left', async () => {
      req = { params: { id: '1' } };
      const error = { message: 'Card not found', statusCode: 404 };
      
      mockServiceInstance.deleteById.mockResolvedValue(Either.left(error));

      await cardController.deleteById(req, res, next);

      expect(mockServiceInstance.deleteById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Card not found' });
    });
  });

  describe('patchCard', () => {
    test('should patch card successfully', async () => {
      req = { params: { id: '1' }, body: { title: 'Patched' } };
      const patchedCard = { id: 1, title: 'Patched', description: 'Old Desc' };
      
      mockServiceInstance.patchCard.mockResolvedValue(Either.right(patchedCard));

      await cardController.patchCard(req, res, next);

      expect(mockServiceInstance.patchCard).toHaveBeenCalledWith(req.body, '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(patchedCard);
    });

    test('should return error if service returns left', async () => {
      req = { params: { id: '1' }, body: { title: 'Patched' } };
      const error = { message: 'Card not found', statusCode: 404 };
      
      mockServiceInstance.patchCard.mockResolvedValue(Either.left(error));

      await cardController.patchCard(req, res, next);

      expect(mockServiceInstance.patchCard).toHaveBeenCalledWith(req.body, '1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Card not found' });
    });
  });

  describe('getTopCard', () => {
    test('should return 400 if idGame missing', async () => {
      req = { body: {} };

      await cardController.getTopCard(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game ID is required' });
      expect(mockServiceInstance.getTopCard).not.toHaveBeenCalled();
    });

    test('should get top card successfully', async () => {
      req = { body: { idGame: '123' } };
      const expectedResponse = {
        game_id: '123',
        top_card: '9 of hearts'
      };
      
      mockServiceInstance.getTopCard.mockResolvedValue(Either.right(expectedResponse));

      await cardController.getTopCard(req, res, next);

      expect(mockServiceInstance.getTopCard).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    test('should return error if no cards found', async () => {
      req = { body: { idGame: '123' } };
      const error = { message: 'There are no cards in this game', statusCode: 404 };
      
      mockServiceInstance.getTopCard.mockResolvedValue(Either.left(error));

      await cardController.getTopCard(req, res, next);

      expect(mockServiceInstance.getTopCard).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'There are no cards in this game' });
    });
  });
});
