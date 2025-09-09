import { CardRepository } from '../../repository/CardRepository.js';
import db from '../../models/index.js';
import Either from '../../utils/Either.js';

jest.mock('../../models/index.js', () => ({
    card: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
    }
}));

describe('CardRepository', () => {
  let repository;
  let mockCard;

  const MOCK_CARD_DATA = 
  
  { name: 'Test Card', value: 10 };
  const MOCK_CARD_ID = 1;
  const MOCK_CARDS_LIST = [
    { id: 1, name: 'Card 1', value: 5 },
    { id: 2, name: 'Card 2', value: 15 }
  ];

  beforeEach(() => {
    repository = new CardRepository();
    mockCard = {
      id: MOCK_CARD_ID,
      name: 'Original Name',
      value: 5,
      save: jest.fn().mockResolvedValue(true)
    };
    jest.clearAllMocks();
  });

  describe('createCard', () => {
    it('should successfully create a new card', async () => {
      const expectedCard = { id: MOCK_CARD_ID, ...MOCK_CARD_DATA };
      db.card.create.mockResolvedValue(expectedCard);

      const result = await repository.createCard(MOCK_CARD_DATA);

      expect(db.card.create).toHaveBeenCalledWith(MOCK_CARD_DATA);
      expect(result).toEqual(new Right(expectedCard));
    });
  });

  describe('getAllCards', () => {
    it('should successfully retrieve all cards', async () => {
      db.card.findAll.mockResolvedValue(MOCK_CARDS_LIST);

      const result = await repository.getAllCards();

      expect(db.card.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(new Right(MOCK_CARDS_LIST));
    });
  });

  describe('getByIdCard', () => {
    it('should successfully retrieve a card by id', async () => {
      const options = { include: [] };
      db.card.findByPk.mockResolvedValue(mockCard);

      const result = await repository.getByIdCard(MOCK_CARD_ID, options);

      expect(db.card.findByPk).toHaveBeenCalledWith(MOCK_CARD_ID, options);
      expect(result).toEqual(new Right(mockCard));
    });

    it('should use empty options object when no options provided', async () => {
      db.card.findByPk.mockResolvedValue(mockCard);

      const result = await repository.getByIdCard(MOCK_CARD_ID);

      expect(db.card.findByPk).toHaveBeenCalledWith(MOCK_CARD_ID, {});
      expect(result).toEqual(new Right(mockCard));
    });
  });

  describe('updateAll', () => {
    it('should successfully update a card', async () => {
      const updateData = { name: 'Updated Name', value: 20 };
      db.card.findByPk.mockResolvedValue(mockCard);
      mockCard.save.mockResolvedValue(mockCard);

      const result = await repository.updateAll(updateData, MOCK_CARD_ID);

      expect(db.card.findByPk).toHaveBeenCalledWith(MOCK_CARD_ID);
      expect(mockCard.name).toBe(updateData.name);
      expect(mockCard.value).toBe(updateData.value);
      expect(mockCard.save).toHaveBeenCalledWith();
      expect(result).toEqual(new Right(mockCard));
    });
  });

  describe('deleteById', () => {
    it('should successfully delete a card by id', async () => {
      db.card.findByPk.mockResolvedValue(mockCard);
      db.card.destroy.mockResolvedValue(1);
      const result = await repository.deleteById(MOCK_CARD_ID);

      expect(db.card.findByPk).toHaveBeenCalledWith(MOCK_CARD_ID);
      expect(db.card.destroy).toHaveBeenCalledWith({ where: { id: MOCK_CARD_ID } });
      expect(result).toEqual(new Right(undefined));
    });
  });

  describe('patchCard', () => {
    it('should successfully patch a card', async () => {
      const patchData = { name: 'Patched Name' };
      db.card.findByPk.mockResolvedValue(mockCard);
      mockCard.save.mockResolvedValue(mockCard);

      const result = await repository.patchCard(patchData, MOCK_CARD_ID);
      expect(db.card.findByPk).toHaveBeenCalledWith(MOCK_CARD_ID);
      expect(mockCard.name).toBe(patchData.name);
      expect(mockCard.save).toHaveBeenCalledWith();
      expect(result).toEqual(new Right(mockCard));
    });
  });
});