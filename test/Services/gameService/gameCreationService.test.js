import { GameCreationService } from "../../../services/gameServices/gameCreationService.js";
import { limitTimeGame } from "../../../plugins/gameLimit.js";
jest.mock("../../../plugins/gameLimit.js");


describe("GameCreationService", () => {
  let gameRepoMock;
  let service;

  beforeEach(() => {
    gameRepoMock = {
      createGame: jest.fn(),
      createGameFast: jest.fn(),
    };
    service = new GameCreationService(gameRepoMock);
    jest.clearAllMocks();
  });

  describe("createGame", () => {
    test("should create game successfully", async () => {
      const dataGame = { name: "Game 1", max_players: 4 };
      const id_owner = "player1";
      const createdGame = { id: "game123" };
      gameRepoMock.createGame.mockResolvedValue(createdGame);

      const result = await service.createGame(dataGame, id_owner);

      expect(gameRepoMock.createGame).toHaveBeenCalledWith({
        ...dataGame,
        game_owner: id_owner,
        current_turn_player_id: id_owner,
      });
      expect(result).toEqual({
        message: "Game created successfully",
        game_id: "game123",
      });
    });

    test("should throw if repo fails", async () => {
      const dataGame = { name: "Game 1", max_players: 4 };
      const id_owner = "player1";
      const error = new Error("DB error");
      gameRepoMock.createGame.mockRejectedValue(error);

      await expect(service.createGame(dataGame, id_owner)).rejects.toThrow("DB error");
    });
  });

  describe("gameFast", () => {
    test("should create fast game successfully", async () => {
      const data = { name: "Fast Game", max_players: 2 };
      const id_owner = "player1";
      const createdFastGame = { id: "fastGame123" };
      gameRepoMock.createGameFast.mockResolvedValue(createdFastGame);

      const result = await service.gameFast(data, id_owner);

      expect(limitTimeGame).toHaveBeenCalledWith(expect.objectContaining(data), 5);
      expect(gameRepoMock.createGameFast).toHaveBeenCalledWith(expect.objectContaining({
        game_owner: id_owner,
        current_turn_player_id: id_owner,
        rules: "Quick game with a maximum of 2 people and a time limit",
        status: "on_hold",
      }));
      expect(result).toEqual({
        message: "Fast Game created successfully",
        game_id: "fastGame123",
      });
    });

    test("should throw error if max_players > 2", async () => {
      const data = { name: "Invalid Game", max_players: 3 };
      const id_owner = "player1";

      await expect(service.gameFast(data, id_owner)).rejects.toThrow(
        "The maximum number of players for a fast game is 2"
      );
      expect(gameRepoMock.createGameFast).not.toHaveBeenCalled();
      expect(limitTimeGame).not.toHaveBeenCalled();
    });

    test("should throw if repo fails", async () => {
      const data = { name: "Fast Game", max_players: 2 };
      const id_owner = "player1";
      const error = new Error("DB error");
      gameRepoMock.createGameFast.mockRejectedValue(error);

      await expect(service.gameFast(data, id_owner)).rejects.toThrow("DB error");
      expect(limitTimeGame).toHaveBeenCalledWith(expect.objectContaining(data), 5);
    });
  });
});
