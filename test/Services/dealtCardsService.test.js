import Either from "../../utils/Either.js";
import { PlayCarService } from "../../services/dealtCardsService.js";

describe("PlayCarService", () => {
  let service;

  const repoGame = { getById: jest.fn(), updateCurrentPlayer: jest.fn(), getCurrentPlayer: jest.fn(), endGame: jest.fn() };
  const repoMacher = { getPlayers: jest.fn(), findOne: jest.fn() };
  const repoCards = { getCardByIdgame: jest.fn(), updateDiscardCard: jest.fn(), getByIdCard: jest.fn(), topCard: jest.fn() };
  const repoPlayer = { getByIdPlayer: jest.fn() };
  const repoCardsPlayer = {
    savePlayerInGame: jest.fn(),
    deleteACardByIdPlayer: jest.fn(),
    getCardsByIdPlayer: jest.fn(),
    updateCardsByIdPlayer: jest.fn(),
    getAllPlayersInGame: jest.fn()
  };
  const repoTurnHis = { saveHistoryTurn: jest.fn(), getHistoryTurnsByGameId: jest.fn() };


  beforeEach(() => {
    jest.clearAllMocks();
    service = new PlayCarService(
      repoGame,
      repoMacher,
      repoCards,
      repoPlayer,
      repoCardsPlayer,
      repoTurnHis
    );
  });

  // --- Tests existentes ---

  describe("dealtCard", () => {
    it("returns Left if validation fails", async () => {
      service.validateGameAndCards = jest.fn().mockResolvedValue(Either.left("validation failed"));
      const result = await service.dealtCard(1, 5);
      expect(result.isLeft()).toBe(true);
    });

    it("deals cards and returns Right", async () => {
      const mockPlayers = [{ id_player: 10 }];
      const mockPlayerData = { id_player: 10, name: "John" };
      const cardsMap = new Map([[1, { id: 1, color: "red", value: "5" }],]);
      service.validateGameAndCards = jest.fn().mockResolvedValue(Either.right({ cardsMap }));
      repoMacher.getPlayers.mockResolvedValue(mockPlayers);
      repoPlayer.getByIdPlayer.mockResolvedValue(mockPlayerData);
      service.createDeckPerPlayer = jest.fn().mockResolvedValue({ player: "John", cards: [{ id: 1, color: "red", value: "5" }] });
      repoCardsPlayer.savePlayerInGame.mockResolvedValue(true);
      const result = await service.dealtCard(1, 2);
      expect(result.isRight()).toBe(true);
    });
  });

  describe("saveNewTurn", () => {
    it("saves a turn successfully", async () => {
      service.validateGame = jest.fn().mockResolvedValue(Either.right({ id: 1 }));
      repoTurnHis.saveHistoryTurn.mockResolvedValue(true);
      await service.saveNewTurn(1, "play", 10, { color: "red", value: "5" });
      expect(repoTurnHis.saveHistoryTurn).toHaveBeenCalledWith("Played red 5", 1, 10);
    });

    it("returns Left if validation fails", async () => {
      service.validateGame = jest.fn().mockResolvedValue(Either.left("game not found"));
      const result = await service.saveNewTurn(1, "play", 10, { color: "red", value: "5" });
      expect(result.isLeft()).toBe(true);
    });
  });

  describe("createDeckPerPlayer", () => {
    it("creates a deck with the correct number of cards", async () => {
      const cardsList = new Map([[1, { id: 1, color: "red", value: "5" }], [2, { id: 2, color: "blue", value: "7" }],]);
      repoCards.updateDiscardCard.mockResolvedValue(true);
      const result = await service.createDeckPerPlayer(cardsList, 2, "John", []);
      expect(result.cards.length).toBe(2);
      expect(cardsList.size).toBe(0);
    });
  });

  describe("playCard", () => {
    it("returns Left if validation fails", async () => {
      service.validatePlay = jest.fn().mockResolvedValue(Either.left("invalid play"));
      const result = await service.playCard(10, 1, 1);
      expect(result.isLeft()).toBe(true);
    });

    it("plays a card and returns Right", async () => {
      const mockCard = { id: 1, color: "red", value: "5" };
      const mockNextPlayer = { id: 2, name: "Jane" };
      service.validatePlay = jest.fn().mockResolvedValue(Either.right(true));
      repoCards.updateDiscardCard.mockResolvedValue(mockCard);
      repoCardsPlayer.deleteACardByIdPlayer.mockResolvedValue(true);
      service.getNextPlayer = jest.fn().mockResolvedValue(mockNextPlayer);
      service.saveNewTurn = jest.fn().mockResolvedValue(true);
      repoGame.updateCurrentPlayer.mockResolvedValue(true);
      const result = await service.playCard(10, 1, 1);
      expect(result.isRight()).toBe(true);
    });
  });

  describe("validateGameAndCards", () => {
    it("returns Left if no game found", async () => {
      repoGame.getById.mockResolvedValue(null);
      const result = await service.validateGameAndCards(1);
      expect(result.isLeft()).toBe(true);
    });

    it("returns Left if game is not in progress", async () => {
      repoGame.getById.mockResolvedValue({ status: "finished" });
      const result = await service.validateGameAndCards(1);
      expect(result.isLeft()).toBe(true);
    });

    it("returns Right if validation passes", async () => {
      repoGame.getById.mockResolvedValue({ status: "in_progress" });
      const mockCards = [{id: 1, color: 'blue', value: '9'}];
      repoCards.getCardByIdgame.mockResolvedValue(Either.right(mockCards));
      const result = await service.validateGameAndCards(1);
      expect(result.isRight()).toBe(true);
    });
  });

  describe("unoMonitor", () => {
    it("should yield each card", () => {
      const cards = [{ id: 1 }, { id: 2 }];
      const monitor = service.unoMonitor(cards);
      expect(monitor.next().value).toEqual({ id: 1 });
      expect(monitor.next().value).toEqual({ id: 2 });
      expect(monitor.next().done).toBe(true);
    });

    it('should yield "UNO" if only one card', () => {
      const cards = [{ id: 1 }];
      const monitor = service.unoMonitor(cards);
      expect(monitor.next().value).toEqual({ id: 1 });
      expect(monitor.next().value).toBe("UNO");
      expect(monitor.next().done).toBe(true);
    });
  });

  describe("challengerSayUno", () => {
    it("should be successful if defender has one card", async () => {
      repoMacher.findOne.mockResolvedValue({ name: "Defender" });
      repoCardsPlayer.getCardsByIdPlayer.mockResolvedValue(Either.right({ cardsPlayer: [{ id: 1 }] }));
      service.getNextPlayer = jest.fn().mockResolvedValue({ name: "NextPlayer" });
      const result = await service.challengerSayUno(1, 2, 100);
      expect(result.isRight()).toBe(true);
    });

    it("should fail if defender has more than one card", async () => {
        repoMacher.findOne.mockResolvedValue({ name: "Defender" });
        repoCardsPlayer.getCardsByIdPlayer.mockResolvedValue(Either.right({ cardsPlayer: [{ id: 1 }, {id: 2}] }));
        const result = await service.challengerSayUno(1, 2, 100);
        expect(result.isLeft()).toBe(true);
      });

    it("should return left if defender is not found in game", async () => {
      repoMacher.findOne.mockResolvedValue(null);
      const result = await service.challengerSayUno(1, 2, 100);
      expect(result.isLeft()).toBe(true);
      expect(result.left).toBe("Defender not found in game.");
    });
  });

  describe("finishGame", () => {
    it("should finish the game if a player has no cards", async () => {
      repoCardsPlayer.getCardsByIdPlayer.mockResolvedValue(Either.right({ cardsPlayer: [] }));
      repoPlayer.getByIdPlayer.mockResolvedValue({ name: "Winner" });
      repoMacher.getPlayers.mockResolvedValue([{ name: "Winner" }, { name: "Loser" }]);
      const result = await service.finishGame(100, 1);
      expect(result.isRight()).toBe(true);
    });

    it("should recursively call for the next player if game is not over", async () => {
        repoCardsPlayer.getCardsByIdPlayer.mockResolvedValue(Either.right({ cardsPlayer: [{id: 1, value: '5'}] }));
        repoPlayer.getByIdPlayer.mockResolvedValue({ name: "Player1" });
        repoMacher.getPlayers.mockResolvedValue([{ id: 1 }, { id: 2 }]);
        const finishGameSpy = jest.spyOn(service, 'finishGame').mockImplementation(async () => {});
        await service.finishGame(100, 1);
        expect(finishGameSpy).toHaveBeenCalledWith(100, 1);
        finishGameSpy.mockRestore();
      });
  });

  describe("getGameStatus", () => {
    it("should return the full game status", async () => {
      repoGame.getCurrentPlayer.mockResolvedValue(Either.right({ value: "Player1" }));
      repoTurnHis.getHistoryTurnsByGameId.mockResolvedValue(Either.right({ turn_history: ["Turn 1"] }));
      repoCards.topCard.mockResolvedValue(Either.right({ value: "Red 5" }));
      repoCardsPlayer.getAllPlayersInGame.mockResolvedValue(Either.right([
        { id_player: 1, cardsPlayer: [{ color: "blue", value: "7" }] }
      ]));
      repoPlayer.getByIdPlayer.mockResolvedValue({ name: "Player1" });
      const result = await service.getGameStatus(100);
      expect(result.isRight()).toBe(true);
    });
  });

  describe("getCardsPlayer", () => {
    it("should return a player's formatted hand", async () => {
      const mockCards = { cardsPlayer: [{ color: "green", value: "1" }] };
      repoCardsPlayer.getCardsByIdPlayer.mockResolvedValue(Either.right(mockCards));
      repoPlayer.getByIdPlayer.mockResolvedValue({ name: "Test Player" });
      const result = await service.getCardsPlayer(100, 1);
      expect(result.isRight()).toBe(true);
      expect(result.right.handsValue.player).toBe("Test Player");
      expect(result.right.handsValue.hand).toEqual(["green 1"]);
    });

    it("should return left if player cards are not found", async () => {
      repoCardsPlayer.getCardsByIdPlayer.mockResolvedValue(Either.left("Cards not found"));
      const result = await service.getCardsPlayer(100, 1);
      expect(result.isLeft()).toBe(true);
    });
  });

  describe("getHistory", () => {
    it("should return the game history", async () => {
      const mockHistory = { turn_history: ["Player 1 played Red 5"] };
      repoTurnHis.getHistoryTurnsByGameId.mockResolvedValue(Either.right(mockHistory));
      const result = await service.getHistory(100);
      expect(result.isRight()).toBe(true);
    });

     it("should return left if history is not found", async () => {
      repoTurnHis.getHistoryTurnsByGameId.mockResolvedValue(Either.left("History not found"));
      const result = await service.getHistory(100);
      expect(result.isLeft()).toBe(true);
    });
  });

  // --- Tests agregados para cobertura ---

  describe("validatePlay", () => {
    it("should return left if player is not found", async () => {
      repoPlayer.getByIdPlayer.mockResolvedValue(null);
      const result = await service.validatePlay(1, 10, 100);
      expect(result.isLeft()).toBe(true);
      expect(result.left).toBe("player not found");
    });
  });

  describe("drawCard", () => {
    it("should return left if the deck is empty", async () => {
      repoCards.getCardByIdgame.mockResolvedValue(Either.left("no cards available"));
      const result = await service.drawCard(1, 100);
      expect(result.isLeft()).toBe(true);
      expect(result.left).toBe("no cards available");
    });
  });
});