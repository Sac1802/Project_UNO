import { GameStatusService } from "../../../services/gameServices/gameStatusService.js";
import { limitTimeGame } from "../../../plugins/gameLimit.js";
import Either from "../../../utils/Either.js";

jest.mock("../../../plugins/gameLimit.js");

describe("GameStatusService", () => {
  let gameRepoMock;
  let service;

  beforeEach(() => {
    gameRepoMock = {
      getById: jest.fn(),
      startGame: jest.fn(),
      endGame: jest.fn(),
      startGameWithTimeLimit: jest.fn(),
    };
    service = new GameStatusService(gameRepoMock);
    jest.clearAllMocks();
  });

  describe("startGame", () => {
    test("should start game if player is owner", async () => {
      const game = { id: 1, game_owner: "player1", status: "on_hold" };
      gameRepoMock.getById.mockResolvedValue(game);
      gameRepoMock.startGame.mockResolvedValue({ ...game, status: "in_progress" });

      const result = await service.startGame(1, "player1");

      expect(gameRepoMock.getById).toHaveBeenCalledWith(1);
      expect(gameRepoMock.startGame).toHaveBeenCalledWith(game, 1);
      expect(result.status).toBe("in_progress");
    });

    test("should return left if player is not owner", async () => {
      const game = { id: 1, game_owner: "player1", status: "on_hold" };
      gameRepoMock.getById.mockResolvedValue(game);

      const result = await service.startGame(1, "player2");

      expect(result).toEqual(Either.left({
        message: "Only the owner of the game can start the game",
        statuscode: 403,
      }));
    });

    test("should throw if game not found", async () => {
      gameRepoMock.getById.mockResolvedValue(null);

      await expect(service.startGame(999, "player1")).rejects.toThrow(
        "The game with 999 not exists"
      );
    });
  });

  describe("endGame", () => {
    test("should end game successfully", async () => {
      const game = { id: 1, status: "in_progress" };
      gameRepoMock.getById.mockResolvedValue(game);
      gameRepoMock.endGame.mockResolvedValue({ ...game, status: "finalized" });

      const result = await service.endGame(1, "player1");

      expect(gameRepoMock.getById).toHaveBeenCalledWith(1);
      expect(gameRepoMock.endGame).toHaveBeenCalledWith(game, 1);
      expect(result.status).toBe("finalized");
    });

    test("should return left if game not found", async () => {
      gameRepoMock.getById.mockResolvedValue(null);

      const result = await service.endGame(999, "player1");

      expect(result).toEqual(Either.left(`The game with 999 not exists`, { statuscode: 404 }));
    });
  });

  describe("getStatusGame", () => {
    test("should return status of game", async () => {
      const game = { id: 1, status: "in_progress" };
      gameRepoMock.getById.mockResolvedValue(game);

      const result = await service.getStatusGame(1);

      expect(result).toEqual({ game_id: 1, state: "in_progress" });
    });

    test("should return left if game not found", async () => {
      gameRepoMock.getById.mockResolvedValue(null);

      const result = await service.getStatusGame(999);

      expect(result).toEqual(Either.left(`The game with 999 not exists`, { statuscode: 404 }));
    });
  });

  describe("startGameWithTimeLimit", () => {
    test("should start game with time limit if owner", async () => {
      const game = { id: 1, game_owner: "player1", status: "on_hold" };
      gameRepoMock.getById.mockResolvedValue(game);
      gameRepoMock.startGameWithTimeLimit.mockResolvedValue({ ...game, status: "in_progress" });

      const result = await service.startGameWithTimeLimit(1, "player1", 5);

      expect(limitTimeGame).toHaveBeenCalledWith(game, 5);
      expect(gameRepoMock.startGameWithTimeLimit).toHaveBeenCalledWith(game, 1);
      expect(result).toEqual({ message: "Game started successfully" });
    });

    test("should return left if player is not owner", async () => {
      const game = { id: 1, game_owner: "player1", status: "on_hold" };
      gameRepoMock.getById.mockResolvedValue(game);

      const result = await service.startGameWithTimeLimit(1, "player2", 5);

      expect(result).toEqual(Either.left(
        { message: "Only the owner of the game can start the game" },
        { statuscode: 403 }
      ));
    });

    test("should return left if game not found", async () => {
      gameRepoMock.getById.mockResolvedValue(null);

      const result = await service.startGameWithTimeLimit(999, "player1", 5);

      expect(result).toEqual(Either.left(`The game with 999 not exists`, { statuscode: 404 }));
    });
  });
});
