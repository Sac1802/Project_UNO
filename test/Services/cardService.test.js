import * as cardService from "../../services/cardService.js";
import card from "../../models/cards.js";

jest.mock("../../models/cards.js");

describe("cardService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a card", async () => {
    const cardData = {
      color: "blue",
      value: "9",
      gameId: 1,
      isDiscarded: false,
    };
    const mockCreatedCard = { id: 1, ...cardData };
    card.create.mockResolvedValue(mockCreatedCard);

    const createdCard = await cardService.createCard(cardData);

    expect(card.create).toHaveBeenCalledWith(cardData);
    expect(createdCard).toEqual(mockCreatedCard);
  });

  test("should get a card by ID", async () => {
    const mockCard = {
      id: 1,
      color: "blue",
      value: "9",
      gameId: 1,
      isDiscarded: false,
    };
    card.findByPk.mockResolvedValue(mockCard);

    const foundCard = await cardService.getByIdCard(1);

    expect(card.findByPk).toHaveBeenCalledWith(1);
    expect(foundCard).toEqual(mockCard);
  });

  test("should throw error if card not found", async () => {
    card.findByPk.mockResolvedValue(null);

    await expect(cardService.getByIdCard(999)).rejects.toThrow(
      "The card with id 999 does not exist"
    );
  });

  test("should update a card", async () => {
    const cardData = { color: "red" };
    const mockCardInstance = {
      save: jest.fn().mockResolvedValue({ id: 1, ...cardData }),
    };
    card.findByPk.mockResolvedValue(mockCardInstance);

    const updatedCard = await cardService.updateAll(cardData, 1);

    expect(card.findByPk).toHaveBeenCalledWith(1);
    expect(mockCardInstance.save).toHaveBeenCalled();
    expect(updatedCard).toEqual({ id: 1, ...cardData });
  });

  test("should throw error if update target card not found", async () => {
    card.findByPk.mockResolvedValue(null);

    await expect(cardService.updateAll({ color: "red" }, 999)).rejects.toThrow(
      "Error can't get card with 999"
    );
  });

  test("should delete a card", async () => {
    const mockCardInstance = {
      destroy: jest.fn().mockResolvedValue(),
    };
    card.findByPk.mockResolvedValue(mockCardInstance);

    await expect(cardService.deleteById(1)).resolves.toBeUndefined();

    expect(card.findByPk).toHaveBeenCalledWith(1);
    expect(mockCardInstance.destroy).toHaveBeenCalled();
  });

  test("should throw error if delete target card not found", async () => {
    card.findByPk.mockResolvedValue(null);
    await expect(cardService.deleteById(999)).rejects.toThrow(
      "Error can't get card with 999"
    );
  });

  test("should patch a card", async () => {
    const cardData = { value: "5" };
    const mockCardInstance = {
      update: jest.fn().mockResolvedValue({ id: 1, ...cardData }),
    };
    card.findByPk.mockResolvedValue(mockCardInstance);

    const patchedCard = await cardService.patchCard(cardData, 1);

    expect(card.findByPk).toHaveBeenCalledWith(1);
    expect(mockCardInstance.update).toHaveBeenCalledWith(cardData);
    expect(patchedCard).toEqual({ id: 1, ...cardData });
  });

  test("should throw error if patch target card not found", async () => {
    card.findByPk.mockResolvedValue(null);
    await expect(cardService.patchCard({ value: "5" }, 999)).rejects.toThrow(
      "Error can't get card with 999"
    );
  });

  test("getAllCards returns all cards", async () => {
    const mockCards = [{ id: 1 }, { id: 2 }];
    card.findAll.mockResolvedValue(mockCards);

    const cards = await cardService.getAllCards();
    expect(card.findAll).toHaveBeenCalled();
    expect(cards).toEqual(mockCards);
  });

  test("getAllCards throws error when findAll fails", async () => {
    card.findAll.mockRejectedValue(new Error("DB error"));

    await expect(cardService.getAllCards()).rejects.toThrow(
      "Error get all cards: DB error"
    );
  });

  test("updateAll throws error if card not found", async () => {
    card.findByPk.mockResolvedValue(null);

    await expect(cardService.updateAll({}, 123)).rejects.toThrow(
      "Error can't get card with 123"
    );
  });

  test("deleteById throws error if card not found", async () => {
    card.findByPk.mockResolvedValue(null);

    await expect(cardService.deleteById(999)).rejects.toThrow(
      "Error can't get card with 999"
    );
  });

  test("patchCard throws error if card not found", async () => {
    card.findByPk.mockResolvedValue(null);

    await expect(cardService.patchCard({}, 999)).rejects.toThrow(
      "Error can't get card with 999"
    );
  });

  test("getTopCrad returns formatted top card info", async () => {
    const mockTopCard = { value: "5", color: "red" };
    card.findOne.mockResolvedValue(mockTopCard);

    const result = await cardService.getTopCrad(10);
    expect(card.findOne).toHaveBeenCalledWith({
      where: { gameId: 10, isDiscarded: true },
      order: [["id", "DESC"]],
    });
    expect(result).toEqual({ game_id: 10, top_card: "5 of red" });
  });

  test("getTopCrad throws error if no top card", async () => {
    card.findOne.mockResolvedValue(null);

    await expect(cardService.getTopCrad(5)).rejects.toThrow(
      "There are no letters in this game"
    );
  });

  test("getTopCrad throws error if findOne throws", async () => {
    card.findOne.mockRejectedValue(new Error("DB fail"));

    await expect(cardService.getTopCrad(5)).rejects.toThrow(
      "Error get top card: DB fail"
    );
  });
});
