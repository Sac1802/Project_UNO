import { CardsService } from "../../services/cardService.js";
import { CardRepository } from "../../repository/CardRepository.js";

jest.mock("../../repository/CardRepository.js");

describe("CardsService", () => {
  let cardsService;
  let mockCardRepository;

  beforeEach(() => {
    mockCardRepository = {
      createCard: jest.fn(),
      getAllCards: jest.fn(),
      getByIdCard: jest.fn(),
      updateAll: jest.fn(),
      deleteById: jest.fn(),
      patchCard: jest.fn(),
      topCard: jest.fn(),
    };

    CardRepository.mockImplementation(() => mockCardRepository);
    cardsService = new CardsService(mockCardRepository);
    jest.clearAllMocks();
  });

  describe("createCard", () => {
    test("should create a card successfully", async () => {
      const cardData = {
        color: "blue",
        value: "9",
        gameId: 1,
      };
      const expectedCardData = {
        ...cardData,
        isDiscarded: false,
      };
      const mockCreatedCard = { id: 1, ...expectedCardData };
      
      mockCardRepository.createCard.mockResolvedValue(mockCreatedCard);

      const result = await cardsService.createCard(cardData);

      expect(mockCardRepository.createCard).toHaveBeenCalledWith(expectedCardData);
      expect(result).toEqual(mockCreatedCard);
    });

    test("should throw error when repository fails", async () => {
      const cardData = { color: "blue", value: "9", gameId: 1 };
      const repositoryError = new Error("Database error");
      
      mockCardRepository.createCard.mockRejectedValue(repositoryError);

      await expect(cardsService.createCard(cardData)).rejects.toThrow(
        "Error create card: Database error"
      );
    });
  });

  describe("getAllCards", () => {
    test("should return all cards successfully", async () => {
      const mockCards = [
        { id: 1, color: "blue", value: "9" },
        { id: 2, color: "red", value: "5" }
      ];
      
      mockCardRepository.getAllCards.mockResolvedValue(mockCards);

      const result = await cardsService.getAllCards();

      expect(mockCardRepository.getAllCards).toHaveBeenCalled();
      expect(result).toEqual(mockCards);
    });

    test("should throw error when repository fails", async () => {
      const repositoryError = new Error("DB error");
      
      mockCardRepository.getAllCards.mockRejectedValue(repositoryError);

      await expect(cardsService.getAllCards()).rejects.toThrow(
        "Error get all cards: DB error"
      );
    });
  });

  describe("getByIdCard", () => {
    test("should get a card by ID successfully", async () => {
      const mockCard = {
        id: 1,
        color: "blue",
        value: "9",
        gameId: 1,
        isDiscarded: false,
      };
      
      mockCardRepository.getByIdCard.mockResolvedValue(mockCard);

      const result = await cardsService.getByIdCard(1);

      expect(mockCardRepository.getByIdCard).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCard);
    });

    test("should throw error if card not found", async () => {
      mockCardRepository.getByIdCard.mockResolvedValue(null);

      await expect(cardsService.getByIdCard(999)).rejects.toThrow(
        "Error get card by Id: The card with id 999 does not exist"
      );
    });

    test("should throw error when repository fails", async () => {
      const repositoryError = new Error("Database error");
      
      mockCardRepository.getByIdCard.mockRejectedValue(repositoryError);

      await expect(cardsService.getByIdCard(1)).rejects.toThrow(
        "Error get card by Id: Database error"
      );
    });
  });

  describe("updateAll", () => {
    test("should update a card successfully", async () => {
      const cardData = { color: "red" };
      const mockExistingCard = { id: 1, color: "blue", value: "9" };
      const mockUpdatedCard = { id: 1, color: "red", value: "9" };
      
      mockCardRepository.getByIdCard.mockResolvedValue(mockExistingCard);
      mockCardRepository.updateAll.mockResolvedValue(mockUpdatedCard);

      const result = await cardsService.updateAll(cardData, 1);

      expect(mockCardRepository.getByIdCard).toHaveBeenCalledWith(1);
      expect(mockCardRepository.updateAll).toHaveBeenCalledWith(cardData, 1);
      expect(result).toEqual(mockUpdatedCard);
    });

    test("should throw error if card not found", async () => {
      mockCardRepository.getByIdCard.mockResolvedValue(null);

      await expect(cardsService.updateAll({ color: "red" }, 999)).rejects.toThrow(
        "Error can't get card with 999"
      );
    });

    test("should throw error when repository update fails", async () => {
      const mockExistingCard = { id: 1, color: "blue", value: "9" };
      const repositoryError = new Error("Update failed");
      
      mockCardRepository.getByIdCard.mockResolvedValue(mockExistingCard);
      mockCardRepository.updateAll.mockRejectedValue(repositoryError);

      await expect(cardsService.updateAll({ color: "red" }, 1)).rejects.toThrow(
        "Error update card: Update failed"
      );
    });
  });

  describe("deleteById", () => {
    test("should delete a card successfully", async () => {
      const mockExistingCard = { id: 1, color: "blue", value: "9" };
      
      mockCardRepository.getByIdCard.mockResolvedValue(mockExistingCard);
      mockCardRepository.deleteById.mockResolvedValue();

      await expect(cardsService.deleteById(1)).resolves.toBeUndefined();

      expect(mockCardRepository.getByIdCard).toHaveBeenCalledWith(1);
      expect(mockCardRepository.deleteById).toHaveBeenCalledWith(1);
    });

    test("should throw error if card not found", async () => {
      mockCardRepository.getByIdCard.mockResolvedValue(null);

      await expect(cardsService.deleteById(999)).rejects.toThrow(
        "Error can't get card with 999"
      );
    });

    test("should throw error when repository delete fails", async () => {
      const mockExistingCard = { id: 1, color: "blue", value: "9" };
      const repositoryError = new Error("Delete failed");
      
      mockCardRepository.getByIdCard.mockResolvedValue(mockExistingCard);
      mockCardRepository.deleteById.mockRejectedValue(repositoryError);

      await expect(cardsService.deleteById(1)).rejects.toThrow(
        "Error delete card: Delete failed"
      );
    });
  });

  describe("patchCard", () => {
    test("should patch a card successfully", async () => {
      const cardData = { value: "5" };
      const mockExistingCard = { id: 1, color: "blue", value: "9" };
      const mockPatchedCard = { id: 1, color: "blue", value: "5" };
      
      mockCardRepository.getByIdCard.mockResolvedValue(mockExistingCard);
      mockCardRepository.patchCard.mockResolvedValue(mockPatchedCard);

      const result = await cardsService.patchCard(cardData, 1);

      expect(mockCardRepository.getByIdCard).toHaveBeenCalledWith(1);
      expect(mockCardRepository.patchCard).toHaveBeenCalledWith(cardData, 1);
      expect(result).toEqual(mockPatchedCard);
    });

    test("should throw error if card not found", async () => {
      mockCardRepository.getByIdCard.mockResolvedValue(null);

      await expect(cardsService.patchCard({ value: "5" }, 999)).rejects.toThrow(
        "Error can't get card with 999"
      );
    });

    test("should throw error when repository patch fails", async () => {
      const mockExistingCard = { id: 1, color: "blue", value: "9" };
      const repositoryError = new Error("Patch failed");
      
      mockCardRepository.getByIdCard.mockResolvedValue(mockExistingCard);
      mockCardRepository.patchCard.mockRejectedValue(repositoryError);

      await expect(cardsService.patchCard({ value: "5" }, 1)).rejects.toThrow(
        "Error update card: Patch failed"
      );
    });
  });

  describe("getTopCard", () => {
    test("should return formatted top card info successfully", async () => {
      const mockTopCard = { value: "5", color: "red" };
      
      mockCardRepository.topCard.mockResolvedValue(mockTopCard);

      const result = await cardsService.getTopCard(10);

      expect(mockCardRepository.topCard).toHaveBeenCalledWith(10);
      expect(result).toEqual({ 
        game_id: 10, 
        top_card: "5 of red" 
      });
    });

    test("should throw error if no top card found", async () => {
      mockCardRepository.topCard.mockResolvedValue(null);

      await expect(cardsService.getTopCard(5)).rejects.toThrow(
        "Error get top card: There are no letters in this game"
      );
    });

    test("should throw error when repository fails", async () => {
      const repositoryError = new Error("DB fail");
      
      mockCardRepository.topCard.mockRejectedValue(repositoryError);

      await expect(cardsService.getTopCard(5)).rejects.toThrow(
        "Error get top card: DB fail"
      );
    });
  });
});