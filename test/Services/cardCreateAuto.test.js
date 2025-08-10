import * as cardCreateAuto from "../../services/cardCreateAuto.js";
import card from "../../models/cards.js";

jest.mock("../../models/cards");

describe("cardCreateAuto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create cards automatically for given game id", async () => {
    card.create.mockResolvedValue({ id: 1 }); // mock para cada create

    const gameId = 123;

    await cardCreateAuto.saveCardsAuto(gameId);

    expect(card.create).toHaveBeenCalledTimes(108);

    expect(card.create).toHaveBeenCalledWith(
      expect.objectContaining({
        color: expect.any(String),
        value: expect.any(String),
        gameId: gameId,
        isDiscarded: false,
      })
    );
  });

  test("should throw error if create fails", async () => {
    card.create.mockRejectedValue(new Error("DB failure"));
    const cardData = { title: "Test Card", description: "Test Description" };

    await expect(cardCreateAuto.saveCardsAuto(cardData)).rejects.toThrow(
      "Error creating cards: DB failure"
    );
  });
});
