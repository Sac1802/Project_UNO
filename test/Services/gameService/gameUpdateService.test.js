import { GameUpdateService } from "../../../services/gameServices/gameUpdateService.js";
import Either from "../../../utils/Either.js";

describe("GameUpdateService", () => {
  let gameRepoMock;
  let service;

  beforeEach(() => {
    gameRepoMock = {
      getById: jest.fn(),
      updateGame: jest.fn(),
      deleteGame: jest.fn(),
      patchGame: jest.fn(),
    };
    service = new GameUpdateService(gameRepoMock);
    jest.clearAllMocks();
  });

  describe("updateAllGame", () => {
    test("should update game successfully", async () => {
      const game = { id: 1, name: "Old Game" };
      const newData = { name: "New Game" };
      gameRepoMock.getById.mockResolvedValue(game);
      gameRepoMock.updateGame.mockResolvedValue({ ...game, ...newData });

      const result = await service.updateAllGame(newData, 1);

      expect(gameRepoMock.getById).toHaveBeenCalledWith(1);
      expect(gameRepoMock.updateGame).toHaveBeenCalledWith(game, newData);
      expect(result).toEqual({ id: 1, name: "New Game" });
    });
  });

  describe("deleteById", () => {
    test("should delete game successfully", async () => {
      const game = { id: 1, name: "Game" };
      gameRepoMock.getById.mockResolvedValue(game);
      gameRepoMock.deleteGame.mockResolvedValue({ message: "Deleted successfully" });

      const result = await service.deleteById(1);

      expect(gameRepoMock.getById).toHaveBeenCalledWith(1);
      expect(gameRepoMock.deleteGame).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: "Deleted successfully" });
    });

    test("should return left if game not found", async () => {
      gameRepoMock.getById.mockResolvedValue(null);

      const result = await service.deleteById(999);

      expect(result).toEqual(Either.left(
        { message: "The game with 999 not exists" },
        { statuscode: 404 }
      ));
    });
  });

  describe("patchGame", () => {
    test("should patch game successfully", async () => {
      const game = { id: 1, name: "Old Game" };
      const newData = { name: "Patched Game" };
      gameRepoMock.getById.mockResolvedValue(game);
      gameRepoMock.patchGame.mockResolvedValue({ ...game, ...newData });

      const result = await service.patchGame(newData, 1);

      expect(gameRepoMock.getById).toHaveBeenCalledWith(1);
      expect(gameRepoMock.patchGame).toHaveBeenCalledWith(game, newData);
      expect(result).toEqual({ id: 1, name: "Patched Game" });
    });

    test("should return left if game not found", async () => {
      gameRepoMock.getById.mockResolvedValue(null);

      const result = await service.patchGame({ name: "New" }, 999);

      expect(result).toEqual(Either.left(
        { message: "The game with 999 not exists" },
        { statuscode: 404 }
      ));
    });
  });
});
