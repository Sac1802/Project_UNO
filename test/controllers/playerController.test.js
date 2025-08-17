import * as playerController from "../../controllers/playerController.js";
import { PlayerService } from "../../services/playerService.js";

jest.mock("../../services/playerService.js");

jest.mock("../../repository/playerRepository.js");

describe("PlayerController", () => {
  let req, res, next;

  beforeEach(() => {
    req = { 
      params: {}, 
      body: {}, 
      user: {} 
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("createPlayer", () => {
    test("should create player successfully", async () => {
      req.body = { name: "John Doe", username: "john", password: "123", email: "john@test.com", age: 25 };
      const response = { message: "User registered successfully" };
      PlayerService.prototype.savePlayer.mockResolvedValue(response);

      await playerController.createPlayer(req, res, next);

      expect(PlayerService.prototype.savePlayer).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(response);
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 if data incomplete", async () => {
      req.body = {};
      await playerController.createPlayer(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "All fields must be completed",
      });
      expect(PlayerService.prototype.savePlayer).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 if data has null values", async () => {
      req.body = { name: "John", username: null, password: "123", email: "john@test.com" };

      await playerController.createPlayer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "All fields must be completed",
      });
      expect(PlayerService.prototype.savePlayer).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 if data has empty string values", async () => {
      req.body = { name: "John", username: "", password: "123", email: "john@test.com" };

      await playerController.createPlayer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "All fields must be completed",
      });
      expect(PlayerService.prototype.savePlayer).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next on service error", async () => {
      req.body = { name: "John Doe", username: "john", password: "123", email: "john@test.com", age: 25 };
      const serviceError = new Error("User already exists");
      PlayerService.prototype.savePlayer.mockRejectedValue(serviceError);

      await playerController.createPlayer(req, res, next);

      expect(PlayerService.prototype.savePlayer).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(serviceError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("getPlayers", () => {
    test("should get all players successfully", async () => {
      const players = [
        { id: 1, name: "John", username: "john" },
        { id: 2, name: "Jane", username: "jane" },
      ];
      PlayerService.prototype.getPlayers.mockResolvedValue(players);

      await playerController.getPlayers(req, res, next);

      expect(PlayerService.prototype.getPlayers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(players);
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next on error", async () => {
      const serviceError = new Error("DB error");
      PlayerService.prototype.getPlayers.mockRejectedValue(serviceError);

      await playerController.getPlayers(req, res, next);

      expect(PlayerService.prototype.getPlayers).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(serviceError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("getByIdPlayer", () => {
    test("should get player by id successfully", async () => {
      req.params.id = "1";
      const player = { id: 1, name: "John", username: "john" };
      PlayerService.prototype.getByIdPlayer.mockResolvedValue(player);

      await playerController.getByIdPlayer(req, res, next);

      expect(PlayerService.prototype.getByIdPlayer).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(player);
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next on error", async () => {
      req.params.id = "999";
      const serviceError = new Error("The player with 999 not exists");
      PlayerService.prototype.getByIdPlayer.mockRejectedValue(serviceError);

      await playerController.getByIdPlayer(req, res, next);

      expect(PlayerService.prototype.getByIdPlayer).toHaveBeenCalledWith("999");
      expect(next).toHaveBeenCalledWith(serviceError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("updateFullPlayer", () => {
    test("should update player successfully", async () => {
      req.params.id = "1";
      req.body = { name: "Updated Name", username: "updated", email: "updated@test.com" };
      const updated = { id: 1, name: "Updated Name", username: "updated" };
      PlayerService.prototype.updateFullPlayer.mockResolvedValue(updated);

      await playerController.updateFullPlayer(req, res, next);

      expect(PlayerService.prototype.updateFullPlayer).toHaveBeenCalledWith(req.body, "1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 if update data incomplete", async () => {
      req.params.id = "1";
      req.body = {};

      await playerController.updateFullPlayer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "All fields must be completed",
      });
      expect(PlayerService.prototype.updateFullPlayer).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 if update data has null values", async () => {
      req.params.id = "1";
      req.body = { name: "Updated", username: null };

      await playerController.updateFullPlayer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "All fields must be completed",
      });
      expect(PlayerService.prototype.updateFullPlayer).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next on service error", async () => {
      req.params.id = "1";
      req.body = { name: "Updated", username: "updated", email: "updated@test.com" };
      const serviceError = new Error("Players cannot be update");
      PlayerService.prototype.updateFullPlayer.mockRejectedValue(serviceError);

      await playerController.updateFullPlayer(req, res, next);

      expect(PlayerService.prototype.updateFullPlayer).toHaveBeenCalledWith(req.body, "1");
      expect(next).toHaveBeenCalledWith(serviceError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("deletePlayer", () => {
    test("should delete player successfully", async () => {
      req.params.id = "1";
      PlayerService.prototype.deletePlayer.mockResolvedValue();

      await playerController.deletePlayer(req, res, next);

      expect(PlayerService.prototype.deletePlayer).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next on error", async () => {
      req.params.id = "999";
      const serviceError = new Error("Error the player with 999 not exists");
      PlayerService.prototype.deletePlayer.mockRejectedValue(serviceError);

      await playerController.deletePlayer(req, res, next);

      expect(PlayerService.prototype.deletePlayer).toHaveBeenCalledWith("999");
      expect(next).toHaveBeenCalledWith(serviceError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });

  describe("patchPlayer", () => {
    test("should patch player successfully", async () => {
      req.params.id = "1";
      req.body = { name: "Patched Name" };
      const patched = { id: 1, name: "Patched Name", username: "john" };
      PlayerService.prototype.patchPlayer.mockResolvedValue(patched);

      await playerController.patchPlayer(req, res, next);

      expect(PlayerService.prototype.patchPlayer).toHaveBeenCalledWith(req.body, "1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(patched);
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next on error", async () => {
      req.params.id = "999";
      req.body = { name: "Patched Name" };
      const serviceError = new Error("Error the player with 999 not exists");
      PlayerService.prototype.patchPlayer.mockRejectedValue(serviceError);

      await playerController.patchPlayer(req, res, next);

      expect(PlayerService.prototype.patchPlayer).toHaveBeenCalledWith(req.body, "999");
      expect(next).toHaveBeenCalledWith(serviceError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("getPlayerByToken", () => {
    test("should return player by token successfully", async () => {
      req.user.playerId = "1";
      const player = { 
        id: 1, 
        username: "john", 
        email: "john@test.com", 
        age: 25 
      };
      PlayerService.prototype.getByIdByToken.mockResolvedValue(player);

      await playerController.getPlayerByToken(req, res, next);

      expect(PlayerService.prototype.getByIdByToken).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(player);
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 if no playerId in token", async () => {
      req.user = {};

      await playerController.getPlayerByToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Player ID is required",
      });
      expect(PlayerService.prototype.getByIdByToken).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 if playerId is null", async () => {
      req.user.playerId = null;

      await playerController.getPlayerByToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Player ID is required",
      });
      expect(PlayerService.prototype.getByIdByToken).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next on service error", async () => {
      req.user.playerId = "999";
      const serviceError = new Error("The player with 999 not exists");
      PlayerService.prototype.getByIdByToken.mockRejectedValue(serviceError);

      await playerController.getPlayerByToken(req, res, next);

      expect(PlayerService.prototype.getByIdByToken).toHaveBeenCalledWith("999");
      expect(next).toHaveBeenCalledWith(serviceError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});