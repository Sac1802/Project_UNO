import { playerInGameRepository } from "../../repository/playerInGameRepository.js";
import Either from "../../utils/Either.js";

jest.mock("../../models/playerInGame.js", () => ({
  playerInGame: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  }
}));

import { playerInGame } from "../../models/playerInGame.js";

describe("playerInGameRepository", () => {
  let repository;

  beforeEach(() => {
    repository = new playerInGameRepository();
    jest.clearAllMocks();
  });

  describe("savePlayerInGame", () => {
    test("should save player and return Right", async () => {
      const mockData = { id: 1, id_game: 10 };
      playerInGame.create.mockResolvedValue(mockData);

      const result = await repository.savePlayerInGame(mockData);

      expect(playerInGame.create).toHaveBeenCalledWith(mockData);
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockData);
    });
  });

  describe("getCardsByIdPlayer", () => {
    test("should return Right when player found", async () => {
      const mockPlayer = { id: 1, id_game: 10, id_player: 5 };
      playerInGame.findOne.mockResolvedValue(mockPlayer);

      const result = await repository.getCardsByIdPlayer(10, 5);

      expect(playerInGame.findOne).toHaveBeenCalledWith({
        where: { id_game: 10, id_player: 5 },
      });
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockPlayer);
    });

    test("should return Left when player not found", async () => {
      playerInGame.findOne.mockResolvedValue(null);

      const result = await repository.getCardsByIdPlayer(10, 99);

      expect(result.isLeft()).toBe(true);
      expect(result.left).toBe("Error not found player or game");
    });
  });

  describe("updateCardsByIdPlayer", () => {
    test("should update and return Right", async () => {
      const mockPlayer = {
        id: 1,
        update: jest.fn().mockResolvedValue(true),
      };
      playerInGame.findOne.mockResolvedValue(mockPlayer);

      const result = await repository.updateCardsByIdPlayer(10, 5, ["card1"]);

      expect(playerInGame.findOne).toHaveBeenCalledWith({
        where: { id_game: 10, id_player: 5 },
      });
      expect(mockPlayer.update).toHaveBeenCalledWith({ cardsPlayer: ["card1"] });
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockPlayer);
    });

    test("should return Left when player not found", async () => {
      playerInGame.findOne.mockResolvedValue(null);

      const result = await repository.updateCardsByIdPlayer(10, 99, []);

      expect(result.isLeft()).toBe(true);
      expect(result.left).toBe("Error not found player");
    });
  });

  describe("deleteACardByIdPlayer", () => {
    test("should delete a card and return Right", async () => {
      const mockPlayer = {
        cardsPlayer: [{ id: 1 }, { id: 2 }],
        update: jest.fn().mockResolvedValue(true),
      };
      playerInGame.findOne.mockResolvedValue(mockPlayer);

      const result = await repository.deleteACardByIdPlayer(10, 5, 1);

      expect(playerInGame.findOne).toHaveBeenCalledWith({
        where: { id_game: 10, id_player: 5 },
      });
      expect(mockPlayer.update).toHaveBeenCalledWith({
        cardsPlayer: [{ id: 2 }],
      });
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual([{ id: 2 }]);
    });

    test("should return Left when player not found", async () => {
      playerInGame.findOne.mockResolvedValue(null);

      const result = await repository.deleteACardByIdPlayer(10, 5, 1);

      expect(result.isLeft()).toBe(true);
      expect(result.left).toBe("Player not found");
    });
  });

  describe("getAllPlayersInGame", () => {
    test("should return Right when players exist", async () => {
      const mockPlayers = [{ id: 1 }, { id: 2 }];
      playerInGame.findAll.mockResolvedValue(mockPlayers);

      const result = await repository.getAllPlayersInGame(10);

      expect(playerInGame.findAll).toHaveBeenCalledWith({
        where: { id_game: 10 },
      });
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockPlayers);
    });

    test("should return Left when no players found", async () => {
      playerInGame.findAll.mockResolvedValue([]);

      const result = await repository.getAllPlayersInGame(10);

      expect(result.isLeft()).toBe(true);
      expect(result.left).toBe("No players in the game");
    });
  });
});
