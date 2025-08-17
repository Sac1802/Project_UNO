import { CardRepository } from '../../repository/CardRepository.js';
import card from '../../models/cards.js';
import Either from '../../utils/Either.js';

jest.mock('../../models/cards.js');

describe('CardRepository', () => {
  let repository;
  let mockCard;

  // Test data constants
  const MOCK_CARD_DATA = { name: 'Test Card', value: 10 };
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
    it('should successfully create a new card and return Right Either', async () => {
      // Arrange
      const expectedCard = { id: MOCK_CARD_ID, ...MOCK_CARD_DATA };
      card.create.mockResolvedValue(expectedCard);

      // Act
      const result = await repository.createCard(MOCK_CARD_DATA);

      // Assert
      expect(card.create).toHaveBeenCalledWith(MOCK_CARD_DATA);
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(expectedCard);
    });
  });

  describe('getAllCards', () => {
    it('should successfully retrieve all cards and return Right Either', async () => {
      card.findAll.mockResolvedValue(MOCK_CARDS_LIST);

      const result = await repository.getAllCards();

      expect(card.findAll).toHaveBeenCalledWith();
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(MOCK_CARDS_LIST);
    });
  });

  describe('getByIdCard', () => {
    it('should successfully retrieve a card by id and return Right Either', async () => {
      const options = { include: [] };
      card.findByPk.mockResolvedValue(mockCard);

      const result = await repository.getByIdCard(MOCK_CARD_ID, options);

      expect(card.findByPk).toHaveBeenCalledWith(MOCK_CARD_ID, options);
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockCard);
    });

    it('should use empty options object when no options provided', async () => {
    
      card.findByPk.mockResolvedValue(mockCard);


      const result = await repository.getByIdCard(MOCK_CARD_ID);

      expect(card.findByPk).toHaveBeenCalledWith(MOCK_CARD_ID, {});
      expect(result.isRight()).toBe(true);
    });
  });

  describe('updateAll', () => {
    it('should successfully update a card and return Right Either', async () => {
      const updateData = { name: 'Updated Name', value: 20 };
      card.findByPk.mockResolvedValue(mockCard);
      mockCard.save.mockResolvedValue(mockCard);

      const result = await repository.updateAll(updateData, MOCK_CARD_ID);

      expect(card.findByPk).toHaveBeenCalledWith(MOCK_CARD_ID);
      expect(mockCard.name).toBe(updateData.name);
      expect(mockCard.value).toBe(updateData.value);
      expect(mockCard.save).toHaveBeenCalledWith();
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockCard);
    });
  });

  describe('deleteById', () => {
    it('should successfully delete a card by id and return Right Either', async () => {
      card.findByPk.mockResolvedValue(mockCard);
      card.destroy.mockResolvedValue(1);
      const result = await repository.deleteById(MOCK_CARD_ID);

      expect(card.findByPk).toHaveBeenCalledWith(MOCK_CARD_ID);
      expect(card.destroy).toHaveBeenCalledWith({ where: { id: MOCK_CARD_ID } });
      expect(result.isRight()).toBe(true);
    });
  });

  describe('patchCard', () => {
    it('should successfully patch a card and return Right Either', async () => {
      const patchData = { name: 'Patched Name' };
      card.findByPk.mockResolvedValue(mockCard);
      mockCard.save.mockResolvedValue(mockCard);

      const result = await repository.patchCard(patchData, MOCK_CARD_ID);
      expect(card.findByPk).toHaveBeenCalledWith(MOCK_CARD_ID);
      expect(mockCard.name).toBe(patchData.name);
      expect(mockCard.save).toHaveBeenCalledWith();
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockCard);
    });
  });
});
