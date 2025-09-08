import { playerInGameRepository } from "../../repository/playerInGameRepository.js";
import db from "../../models/index.js";
import Either from "../../utils/Either.js";

jest.mock("../../models/index.js", () => ({
  playerInGame: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  }
}));

describe("playerInGameRepository", () => {
  let repository;

  beforeEach(() => {
    repository = new playerInGameRepository();
    jest.clearAllMocks();
  });

  describe("savePlayerInGame", () => {
    test("should save player and return Right", async () => {
      const mockData = { id: 1, id_game: 10 };
      db.playerInGame.create.mockResolvedValue(mockData);

      const result = await repository.savePlayerInGame(mockData);

      expect(db.playerInGame.create).toHaveBeenCalledWith(mockData);
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockData);
    });
  });

  describe("getCardsByIdPlayer", () => {
    test("should return Right when player found", async () => {
      const mockPlayer = { id: 1, id_game: 10, id_player: 5 };
      db.playerInGame.findOne.mockResolvedValue(mockPlayer);

      const result = await repository.getCardsByIdPlayer(10, 5);

      expect(db.playerInGame.findOne).toHaveBeenCalledWith({
        where: { id_game: 10, id_player: 5 },
      });
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockPlayer);
    });

    test("should return Left when player not found", async () => {
      db.playerInGame.findOne.mockResolvedValue(null);

      const result = await repository.getCardsByIdPlayer(10, 99);

      expect(result.isLeft()).toBe(true);
      expect(result.left).toEqual({ message: "Error not found player or game", statusCode: 404 });
    });
  });

  describe("updateCardsByIdPlayer", () => {
    test("should update and return Right", async () => {
      const mockPlayer = {
        id: 1,
        update: jest.fn().mockResolvedValue(true),
      };
      db.playerInGame.findOne.mockResolvedValue(mockPlayer);

      const result = await repository.updateCardsByIdPlayer(10, 5, ["card1"]);

      expect(db.playerInGame.findOne).toHaveBeenCalledWith({
        where: { id_game: 10, id_player: 5 },
      });
      expect(mockPlayer.update).toHaveBeenCalledWith({ cardsPlayer: ["card1"] });
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockPlayer);
    });

    test("should return Left when player not found", async () => {
      db.playerInGame.findOne.mockResolvedValue(null);

      const result = await repository.updateCardsByIdPlayer(10, 99, []);

      expect(result.isLeft()).toBe(true);
      expect(result.left).toEqual({ message: "Error not found player", statusCode: 404 });
    });
  });

  describe("deleteACardByIdPlayer", () => {
    test("should delete a card and return Right", async () => {
      const mockPlayer = {
        cardsPlayer: [{ id: 1 }, { id: 2 }],
        update: jest.fn().mockResolvedValue(true),
      };
      db.playerInGame.findOne.mockResolvedValue(mockPlayer);

      const result = await repository.deleteACardByIdPlayer(10, 5, 1);

      expect(db.playerInGame.findOne).toHaveBeenCalledWith({
        where: { id_game: 10, id_player: 5 },
      });
      expect(mockPlayer.update).toHaveBeenCalledWith({
        cardsPlayer: [{ id: 2 }],
      });
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual([{ id: 2 }]);
    });

    test("should return Left when player not found", async () => {
      db.playerInGame.findOne.mockResolvedValue(null);

      const result = await repository.deleteACardByIdPlayer(10, 5, 1);

      expect(result.isLeft()).toBe(true);
      expect(result.left).toEqual({ message: "Player not found", statusCode: 404 });
    });
  });

  describe("getAllPlayersInGame", () => {
    test("should return Right when players exist", async () => {
      const mockPlayers = [{ id: 1 }, { id: 2 }];
      db.playerInGame.findAll.mockResolvedValue(mockPlayers);

      const result = await repository.getAllPlayersInGame(10);

      expect(db.playerInGame.findAll).toHaveBeenCalledWith({
        where: { id_game: 10 },
      });
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockPlayers);
    });

    test("should return Left when no players found", async () => {
      db.playerInGame.findAll.mockResolvedValue([]);

      const result = await repository.getAllPlayersInGame(10);

      expect(result.isLeft()).toBe(true);
      expect(result.left).toEqual({ message: "No players in the game", statusCode: 404 });
    });
  });
});