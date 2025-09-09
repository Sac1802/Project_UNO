import { RulesService } from "../../services/rulesServices.js";
import Either from "../../utils/Either.js";

describe("RulesService", () => {
  let matchRepo, gameRepo, orderRepo, playerInGame, cardRepo, service;

  beforeEach(() => {
    matchRepo = {
      getPlayersId: jest.fn(),
      listUser: jest.fn(),
      getPlayersAsc: jest.fn(),
    };
    gameRepo = {
      getCurrentPlayer: jest.fn(),
      updateCurrentPlayer: jest.fn(),
    };
    orderRepo = {
      getOrdersByGame: jest.fn(),
      updateOrderGame: jest.fn(),
    };
    playerInGame = {
      getCardsByIdPlayer: jest.fn(),
      updateCardsByIdPlayer: jest.fn(),
      getAllPlayersInGame: jest.fn(),
    };
    cardRepo = {
      getCardByIdgame: jest.fn(),
      topCard: jest.fn(),
    };

    service = new RulesService(
      matchRepo,
      gameRepo,
      orderRepo,
      playerInGame,
      cardRepo
    );
  });

  describe("nextTurn", () => {
    it("should update to the next player", async () => {
      gameRepo.getCurrentPlayer.mockResolvedValue(Either.right("p1"));
      matchRepo.getPlayersId.mockResolvedValue(
        Either.right([
          { id: "p1", username: "A" },
          { id: "p2", username: "B" },
        ])
      );
      gameRepo.updateCurrentPlayer.mockResolvedValue();

      const result = await service.nextTurn("g1");

      expect(gameRepo.updateCurrentPlayer).toHaveBeenCalledWith("g1", "p2");
      expect(result.right.body.nextPlayer).toBe("B");
    });
  });

  describe("skipPlayer", () => {
    it("should skip the next player", async () => {
      gameRepo.getCurrentPlayer.mockResolvedValue(Either.right("p1"));
      matchRepo.listUser.mockResolvedValue(
        Either.right([
          {
            id: "p1",
            deckPerPlayer: { cards: [{ id: "c1" }] },
          },
        ])
      );
      matchRepo.getPlayersId.mockResolvedValue(
        Either.right([
          { id: "p1", username: "A" },
          { id: "p2", username: "B" },
          { id: "p3", username: "C" },
        ])
      );
      playerInGame.getAllPlayersInGame.mockResolvedValue(
        Either.right([
          { id: "p1", cardsPlayer: JSON.stringify({ cards: [{ id: "c1" }] }) },
          { id: "p2", cardsPlayer: JSON.stringify({ cards: [] }) },
          { id: "p3", cardsPlayer: JSON.stringify({ cards: [] }) },
        ])
      );

      const result = await service.skipPlayer("g1", "c1");

      expect(gameRepo.updateCurrentPlayer).toHaveBeenCalledWith("g1", "p3");
      expect(result.right.body.skippedPlayer).toBe("B");
      expect(result.right.body.nextPlayer).toBe("C");
    });
  });

  describe("reverseOrder", () => {
    it("should reverse order from clockwise to counterclockwise", async () => {
      gameRepo.getCurrentPlayer.mockResolvedValue(Either.right("p1"));
      orderRepo.getOrdersByGame.mockResolvedValue(
        Either.right({ order_game: "clockwise" })
      );
      matchRepo.getPlayersAsc.mockResolvedValue(
        Either.right([
          { id: "p1", username: "A" },
          { id: "p2", username: "B" },
        ])
      );

      const result = await service.reverseOrder("g1");

      expect(orderRepo.updateOrderGame).toHaveBeenCalledWith(
        "g1",
        "counterclockwise"
      );
      expect(result.right.body.newDirection).toBe("counterclockwise");
    });
  });
});
