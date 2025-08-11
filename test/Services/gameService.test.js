import game from "../../models/games.js";
import player from "../../models/player.js";
import * as gameService from "../../services/gameService.js";

beforeEach(() => {
  jest.spyOn(game, "create").mockReset();
  jest.spyOn(game, "findAll").mockReset();
  jest.spyOn(game, "findByPk").mockReset();
  jest.spyOn(player, "findByPk").mockReset();
  jest.spyOn(game, "findByPk");
});

describe("gameService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createGame", () => {
    test("should create game successfully", async () => {
      game.create.mockResolvedValue({ id: 1 });
      const data = { name: "Test Game", status: "waiting" };
      const id_owner = 5;

      const result = await gameService.createGame(data, id_owner);

      expect(game.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...data,
          game_owner: id_owner,
          current_turn_player_id: id_owner,
        })
      );
      expect(result).toEqual({
        message: "Game created successfully",
        game_id: 1,
      });
    });

    test("should throw error if create fails", async () => {
      game.create.mockRejectedValue(new Error("DB failure"));
      await expect(gameService.createGame({}, 1)).rejects.toThrow(
        "Error creating game: DB failure"
      );
    });
  });

  describe("getAllGames", () => {
    test("should return all games", async () => {
      const games = [{ id: 1 }, { id: 2 }];
      game.findAll.mockResolvedValue(games);

      const result = await gameService.getAllGames();

      expect(game.findAll).toHaveBeenCalled();
      expect(result).toBe(games);
    });

    test("should throw error if findAll fails", async () => {
      game.findAll.mockRejectedValue(new Error("DB error"));
      await expect(gameService.getAllGames()).rejects.toThrow(
        "Error game cannot be obtained: DB error"
      );
    });
  });

  describe("getById", () => {
    test("should return game by id", async () => {
      const gameData = { id: 1 };
      game.findByPk.mockResolvedValue(gameData);

      const result = await gameService.getById(1);

      expect(game.findByPk).toHaveBeenCalledWith(1);
      expect(result).toBe(gameData);
    });

    test("should throw error if findByPk throws", async () => {
      game.findByPk.mockRejectedValue(new Error("Not found"));
      await expect(gameService.getById(1)).rejects.toThrow(
        "The game with 1 not exists"
      );
    });
  });

  describe("startGame", () => {
    test("should start game if user is owner", async () => {
      const mockGame = {
        game_owner: 1,
        update: jest.fn().mockResolvedValue(),
      };
      game.findByPk.mockResolvedValue(mockGame);

      const result = await gameService.startGame(10, 1);

      expect(mockGame.update).toHaveBeenCalledWith({ status: "in_progress" });
      expect(result).toEqual({ message: "Game started successfully" });
    });

    test("should return error if user is not owner", async () => {
      game.findByPk.mockResolvedValue({ game_owner: 99, update: jest.fn() });

      const result = await gameService.startGame(10, 5);

      expect(result).toEqual({
        message: "Only the owner of the game can start the game",
      });
    });
  });

  describe("endGame", () => {
    test("should end game if user is owner", async () => {
      const mockGame = {
        game_owner: 1,
        update: jest.fn().mockResolvedValue(),
      };
      game.findByPk.mockResolvedValue(mockGame);

      const result = await gameService.endGame(10, 1);

      expect(mockGame.update).toHaveBeenCalledWith({ status: "finalized" });
      expect(result).toEqual({ message: "Game ended successfully" });
    });

    test("should return error if user is not owner", async () => {
      game.findByPk.mockResolvedValue({ game_owner: 99, update: jest.fn() });

      const result = await gameService.endGame(10, 5);

      expect(result).toEqual({
        message: "Only the owner of the game can start the game",
      });
    });
  });

  describe("getStatusGame", () => {
    test("should return status if game exists", async () => {
      game.findByPk.mockResolvedValue({ status: "waiting" });

      const result = await gameService.getStatusGame(5);

      expect(result).toEqual({ game_id: 5, state: "waiting" });
    });

    test("should throw error if game not found", async () => {
      game.findByPk.mockResolvedValue(null);
      await expect(gameService.getStatusGame(5)).rejects.toThrow(
        "The game with 5 not exists"
      );
    });
  });

  describe("getCurrentPlayer", () => {
    test("should return current player username", async () => {
      const mockGame = {
        currentPlayer: { username: "player1" },
      };
      game.findByPk.mockResolvedValue(mockGame);

      const result = await gameService.getCurrentPlayer(10);

      expect(result).toEqual({
        game_id: 10,
        current_player: "player1",
      });
    });

    test("should return 'Unknown' if no current player username", async () => {
      const mockGame = { currentPlayer: null };
      game.findByPk.mockResolvedValue(mockGame);

      const result = await gameService.getCurrentPlayer(10);

      expect(result.current_player).toBe("Unknown");
    });

    test("should return error message if game not found", async () => {
      game.findByPk.mockResolvedValue(null);

      const result = await gameService.getCurrentPlayer(10);

      expect(result).toEqual({ message: "Game not found" });
    });

    test("should return error object on failure", async () => {
      game.findByPk.mockRejectedValue(new Error("DB failure"));

      const result = await gameService.getCurrentPlayer(10);

      expect(result.message).toBe(
        "An error occurred while retrieving the current player"
      );
      expect(result.error).toBe("DB failure");
    });
  });
});

describe("patchGame", () => {
  test("should patch game successfully", async () => {
    const gameInstance = {
      update: jest.fn().mockResolvedValue("patched"),
    };
    game.findByPk.mockResolvedValue(gameInstance);

    const result = await gameService.patchGame({ status: "paused" }, 1);

    expect(game.findByPk).toHaveBeenCalledWith(1);
    expect(gameInstance.update).toHaveBeenCalledWith({ status: "paused" });
    expect(result).toBe("patched");
  });

  test("should throw error if game not found", async () => {
    game.findByPk.mockResolvedValue(null);
    await expect(gameService.patchGame({}, 99)).rejects.toThrow(
      "The game with 99 not exists"
    );
  });

  test("should throw error if update fails", async () => {
    const gameInstance = {
      update: jest.fn().mockRejectedValue(new Error("update error")),
    };
    game.findByPk.mockResolvedValue(gameInstance);

    await expect(gameService.patchGame({}, 1)).rejects.toThrow(
      "Error update game: update error"
    );
  });
});
describe("deleteById", () => {
  test("should delete game successfully", async () => {
    const gameInstance = {
      destroy: jest.fn().mockResolvedValue(true),
    };
    game.findByPk.mockResolvedValue(gameInstance);

    await gameService.deleteById(1);

    expect(game.findByPk).toHaveBeenCalledWith(1);
    expect(gameInstance.destroy).toHaveBeenCalled();
  });

  test("should throw error if game not found", async () => {
    game.findByPk.mockResolvedValue(null);
    await expect(gameService.deleteById(99)).rejects.toThrow(
      "The game with 99 not exists"
    );
  });

  test("should throw error if destroy fails", async () => {
    const gameInstance = {
      destroy: jest.fn().mockRejectedValue(new Error("destroy error")),
    };
    game.findByPk.mockResolvedValue(gameInstance);

    await expect(gameService.deleteById(1)).rejects.toThrow(
      "Error deleting game: destroy error"
    );
  });
});
