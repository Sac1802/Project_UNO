import { CardCreateAuto } from "../../services/cardCreateAuto.js";

describe("cardCreateAuto", () => {
  let mockCardRepository;
  let cardCreateAuto;

  beforeEach(() => {
    mockCardRepository = {
      create: jest.fn(),
    };
    cardCreateAuto = new CardCreateAuto(mockCardRepository);
    jest.clearAllMocks();
  });

  test("should create cards automatically for given game id", async () => {
    mockCardRepository.create.mockResolvedValue({ id: 1 });

    const gameId = 123;

    await cardCreateAuto.saveCardsAuto(gameId);

    expect(mockCardRepository.create).toHaveBeenCalledTimes(108);

    expect(mockCardRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        color: expect.any(String),
        value: expect.any(String),
        gameId: gameId,
        isDiscarded: false,
      })
    );
  });

  test("should throw error if create fails", async () => {
    mockCardRepository.create.mockRejectedValue(new Error("DB failure"));

    const gameId = 123;

    await expect(cardCreateAuto.saveCardsAuto(gameId)).rejects.toThrow(
      "Error creating cards: DB failure"
    );
  });
});