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
        Either.right([{ id: "p1", username: "A" }, { id: "p2", username: "B" }])
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
        Either.right({ order: "clockwise" })
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

  describe("cardPlay", () => {
    it("should play a matching card", async () => {
      playerInGame.getCardsByIdPlayer.mockResolvedValue(
        Either.right([{ color: "red", value: "2" }])
      );
      cardRepo.getCardByIdgame.mockResolvedValue(
        Either.right([{ color: "red", value: "5" }])
      );
      cardRepo.topCard.mockResolvedValue(Either.right({ color: "red", value: "9" }));

      const result = await service.cardPlay("g1", "p1");

      expect(playerInGame.updateCardsByIdPlayer).toHaveBeenCalled();
      expect(result.right.body.playable).toBe(true);
      expect(result.right.body.drawnCard).toBe("red_5");
    });

    it("should pass turn if no playable card", async () => {
      playerInGame.getCardsByIdPlayer.mockResolvedValue(
        Either.right([{ color: "red", value: "2" }])
      );
      cardRepo.getCardByIdgame.mockResolvedValue(
        Either.right([{ color: "blue", value: "5" }])
      );
      cardRepo.topCard.mockResolvedValue(Either.right({ color: "red", value: "9" }));

      matchRepo.getPlayersId.mockResolvedValue(
        Either.right([
          { id: "p1", username: "A" },
          { id: "p2", username: "B" },
        ])
      );

      gameRepo.updateCurrentPlayer.mockResolvedValue();

      const result = await service.cardPlay("g1", "p1");

      expect(gameRepo.updateCurrentPlayer).toHaveBeenCalledWith("g1", "p2");
      expect(result.left).toContain("There is no playable card");
    });
  });
});
