import * as gameController from "../../controllers/gameController.js";
import { GameCreationService } from "../../services/gameServices/gameCreationService.js";
import { GameStatusService } from "../../services/gameServices/gameStatusService.js";
import { GameGetService } from "../../services/gameServices/gameGetService.js";
import { GameUpdateService } from "../../services/gameServices/gameUpdateService.js";
import * as matchController from "../../controllers/matchController.js";
import { CardCreateAuto } from "../../services/cardCreateAuto.js";

jest.mock("../../services/gameServices/gameCreationService.js");
jest.mock("../../services/gameServices/gameStatusService.js");
jest.mock("../../services/gameServices/gameGetService.js");
jest.mock("../../services/gameServices/gameUpdateService.js");
jest.mock("../../services/cardCreateAuto.js");
jest.mock("../../controllers/matchController.js");

describe("gameController", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("createGame", () => {
    test("should create game successfully", async () => {
      req = { body: { name: "Test Game" }, user: { playe: "user1" } };
      const gameCreated = { game_id: "123", name: "Test Game" };
      GameCreationService.prototype.createGame.mockResolvedValue(gameCreated);
      CardCreateAuto.prototype.saveCardsAuto.mockResolvedValue();

      await gameController.createGame(req, res, next);

      expect(GameCreationService.prototype.createGame).toHaveBeenCalledWith(
        req.body,
        "user1"
      );
      expect(CardCreateAuto.prototype.saveCardsAuto).toHaveBeenCalledWith(
        "123"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(gameCreated);
    });

    test("should return 400 if validation fails", async () => {
      req = { body: { name: "" }, user: { playe: "user1" } };

      await gameController.createGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields must be completed",
      });
    });

    test("should call next on error", async () => {
      req = { body: { name: "Test Game" }, user: { playe: "user1" } };
      GameCreationService.prototype.createGame.mockRejectedValue(
        new Error("DB error")
      );

      await gameController.createGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getAllGames", () => {
    test("should return games successfully", async () => {
      req = {};
      const games = [{ id: 1 }, { id: 2 }];
      GameGetService.prototype.getAllGames.mockResolvedValue(games);

      await gameController.getAllGames(req, res, next);

      expect(GameGetService.prototype.getAllGames).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(games);
    });
  });

  describe("getById", () => {
    test("should return game by id", async () => {
      req = { params: { id: "1" } };
      const game = { id: 1, name: "Test Game" };
      GameGetService.prototype.getById.mockResolvedValue(game);

      await gameController.getById(req, res, next);

      expect(GameGetService.prototype.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(game);
    });
  });

  describe("updateAllGame", () => {
    test("should update game successfully", async () => {
      req = { params: { id: "1" }, body: { name: "Updated Game" } };
      const updatedGame = { id: 1, name: "Updated Game" };
      GameUpdateService.prototype.updateAllGame.mockResolvedValue(updatedGame);

      await gameController.updateAllGame(req, res, next);

      expect(GameUpdateService.prototype.updateAllGame).toHaveBeenCalledWith(
        req.body,
        "1"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedGame);
    });

    test("should return 400 if validation fails", async () => {
      req = { params: { id: "1" }, body: { name: "" } };

      await gameController.updateAllGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields must be completed",
      });
    });
  });

  describe("deleteById", () => {
    test("should delete game successfully", async () => {
      req = { params: { id: "1" } };
      GameUpdateService.prototype.deleteById.mockResolvedValue();

      await gameController.deleteById(req, res, next);

      expect(GameUpdateService.prototype.deleteById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe("startGame", () => {
    test("should return 400 if idGame missing", async () => {
      req = { body: {}, user: { playerId: "user1" } };

      await gameController.startGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Game ID is required" });
    });

    test("should start game successfully", async () => {
      req = { body: { idGame: "123" }, user: { playerId: "user1" } };
      const response = { started: true };
      GameStatusService.prototype.startGame.mockResolvedValue(response);
      matchController.startGame.mockResolvedValue();

      await gameController.startGame(req, res, next);

      expect(GameStatusService.prototype.startGame).toHaveBeenCalledWith(
        "123",
        "user1"
      );
      expect(matchController.startGame).toHaveBeenCalledWith(
        "123",
        "user1",
        next
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });

  describe("endGame", () => {
    test("should end game successfully", async () => {
      req = { body: { idGame: "123" }, user: { playerId: "user1" } };
      const response = { ended: true };
      GameStatusService.prototype.endGame.mockResolvedValue(response);
      matchController.endedGame.mockResolvedValue();

      await gameController.endGame(req, res, next);

      expect(GameStatusService.prototype.endGame).toHaveBeenCalledWith(
        "123",
        "user1"
      );
      expect(matchController.endedGame).toHaveBeenCalledWith(
        "123",
        "user1",
        next
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });

  describe("getStatusGame", () => {
    test("should return 400 if idGame missing", async () => {
      req = { body: {} };

      await gameController.getStatusGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Game ID is required" });
    });

    test("should return status successfully", async () => {
      req = { body: { idGame: "123" } };
      const response = { status: "ongoing" };
      GameStatusService.prototype.getStatusGame.mockResolvedValue(response);

      await gameController.getStatusGame(req, res, next);

      expect(GameStatusService.prototype.getStatusGame).toHaveBeenCalledWith(
        "123"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });

  describe("currentPlayer", () => {
    test("should return current player successfully", async () => {
      req = { body: { idGame: "123" } };
      const response = { player: "user1" };
      GameGetService.prototype.getCurrentPlayer.mockResolvedValue(response);

      await gameController.currentPlayer(req, res, next);

      expect(GameGetService.prototype.getCurrentPlayer).toHaveBeenCalledWith(
        "123"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(response);
    });
  });

  describe("createGameFast", () => {
    test("should create game fast successfully", async () => {
      req = { body: { name: "Fast Game" }, user: { playerId: "user1" } };
      const gameCreated = { game_id: "123", name: "Fast Game" };
      GameCreationService.prototype.gameFast.mockResolvedValue(gameCreated);
      CardCreateAuto.prototype.saveCardsAuto.mockResolvedValue();

      await gameController.createGameFast(req, res, next);

      expect(GameCreationService.prototype.gameFast).toHaveBeenCalledWith(
        req.body,
        "user1"
      );
      expect(CardCreateAuto.prototype.saveCardsAuto).toHaveBeenCalledWith(
        "123"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(gameCreated);
    });
  });

  describe("createGameWithLimit", () => {
    test("should create game with limit successfully", async () => {
      req = {
        body: { name: "Limited Game", limitTime: 30 },
        user: { playerId: "user1" },
      };
      const gameCreated = { game_id: "123", name: "Limited Game" };
      GameCreationService.prototype.gameWithLimit.mockResolvedValue(
        gameCreated
      );
      CardCreateAuto.prototype.saveCardsAuto.mockResolvedValue();

      await gameController.createGameWithLimit(req, res, next);

      expect(GameCreationService.prototype.gameWithLimit).toHaveBeenCalledWith(
        req.body,
        "user1",
        30
      );
      expect(CardCreateAuto.prototype.saveCardsAuto).toHaveBeenCalledWith(
        "123"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(gameCreated);
    });
  });

  describe("gameController errors and edge cases", () => {
    let req, res, next;

    beforeEach(() => {
      jest.clearAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      };
      next = jest.fn();
    });

    test("getById should call next on service error", async () => {
      req = { params: { id: "1" } };
      GameGetService.prototype.getById.mockRejectedValue(new Error("DB error"));

      await gameController.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test("updateAllGame should call next on service error", async () => {
      req = { params: { id: "1" }, body: { name: "Updated" } };
      GameUpdateService.prototype.updateAllGame.mockRejectedValue(
        new Error("DB error")
      );

      await gameController.updateAllGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test("patchGame should return 200 on success and call service", async () => {
      req = { params: { id: "1" }, body: { name: "Patched" } };
      const patchedGame = { id: "1", name: "Patched" };
      GameUpdateService.prototype.patchGame.mockResolvedValue(patchedGame);

      await gameController.patchGame(req, res, next);

      expect(GameUpdateService.prototype.patchGame).toHaveBeenCalledWith(
        req.body,
        "1"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(patchedGame);
    });

    test("patchGame should call next on service error", async () => {
      req = { params: { id: "1" }, body: { name: "Patched" } };
      GameUpdateService.prototype.patchGame.mockRejectedValue(
        new Error("DB error")
      );

      await gameController.patchGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test("currentPlayer should return 400 if idGame missing", async () => {
      req = { body: {} };

      await gameController.currentPlayer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Game ID is required" });
    });

    test("createGameFast should return 400 if validation fails", async () => {
      req = { body: { name: "" }, user: { playerId: "user1" } };

      await gameController.createGameFast(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields must be completed",
      });
    });

    test("createGameWithLimit should return 400 if validation fails", async () => {
      req = { body: { name: "" }, user: { playerId: "user1" } };

      await gameController.createGameWithLimit(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields must be completed",
      });
    });

    test("startGame should call next on service error", async () => {
      req = { body: { idGame: "123" }, user: { playerId: "user1" } };
      GameStatusService.prototype.startGame.mockRejectedValue(
        new Error("DB error")
      );

      await gameController.startGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test("endGame should call next on service error", async () => {
      req = { body: { idGame: "123" }, user: { playerId: "user1" } };
      GameStatusService.prototype.endGame.mockRejectedValue(
        new Error("DB error")
      );

      await gameController.endGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test("getStatusGame should call next on service error", async () => {
      req = { body: { idGame: "123" } };
      GameStatusService.prototype.getStatusGame.mockRejectedValue(
        new Error("DB error")
      );

      await gameController.getStatusGame(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
