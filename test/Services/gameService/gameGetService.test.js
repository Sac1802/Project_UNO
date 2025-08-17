import { GameGetService } from "../../../services/gameServices/gameGetService.js";
import player from "../../../models/player.js";
import Either from "../../../utils/Either.js";

describe("GameGetService", () => {
  let gameRepoMock;
  let service;

  beforeEach(() => {
    gameRepoMock = {
      getAllGames: jest.fn(),
      getById: jest.fn(),
    };
    service = new GameGetService(gameRepoMock);
    jest.clearAllMocks();
  });

  describe("getAllGames", () => {
    test("should return all games successfully", async () => {
      const games = [{ id: 1, name: "Game 1" }, { id: 2, name: "Game 2" }];
      gameRepoMock.getAllGames.mockResolvedValue(games);

      const result = await service.getAllGames();

      expect(gameRepoMock.getAllGames).toHaveBeenCalled();
      expect(result).toEqual(games);
    });

    test("should throw if repo fails", async () => {
      const error = new Error("DB error");
      gameRepoMock.getAllGames.mockRejectedValue(error);

      await expect(service.getAllGames()).rejects.toThrow("DB error");
    });
  });

  describe("getById", () => {
    test("should return game by id successfully", async () => {
      const game = { id: 1, name: "Game 1" };
      gameRepoMock.getById.mockResolvedValue(game);

      const result = await service.getById(1);

      expect(gameRepoMock.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(game);
    });

    test("should throw if repo fails", async () => {
      const error = new Error("DB error");
      gameRepoMock.getById.mockRejectedValue(error);

      await expect(service.getById(1)).rejects.toThrow("DB error");
    });
  });

  describe("getCurrentPlayer", () => {
    test("should return current player username if exists", async () => {
      const gameData = {
        currentPlayer: { username: "JohnDoe" },
      };
      gameRepoMock.getById.mockResolvedValue(gameData);

      const result = await service.getCurrentPlayer(1);

      expect(gameRepoMock.getById).toHaveBeenCalledWith(1, {
        include: {
          model: player,
          as: "currentPlayer",
          attributes: ["username"],
          required: false,
        },
      });
      expect(result).toEqual({
        game_id: 1,
        current_player: "JohnDoe",
      });
    });

    test("should return 'Unknown' if current player is null", async () => {
      const gameData = { currentPlayer: null };
      gameRepoMock.getById.mockResolvedValue(gameData);

      const result = await service.getCurrentPlayer(1);

      expect(result).toEqual({
        game_id: 1,
        current_player: "Unknown",
      });
    });

    test("should return left if game not found", async () => {
      gameRepoMock.getById.mockResolvedValue(null);

      const result = await service.getCurrentPlayer(999);

      expect(result).toEqual(Either.left({ message: "Game not found", statuscode: 404 }));
    });

    test("should throw if repo fails", async () => {
      const error = new Error("DB error");
      gameRepoMock.getById.mockRejectedValue(error);

      await expect(service.getCurrentPlayer(1)).rejects.toThrow("DB error");
    });
  });
});
