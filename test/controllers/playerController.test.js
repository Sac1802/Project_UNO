import * as playerController from "../../controllers/playerController.js";
import * as playerService from "../../services/playerService.js";

jest.mock("../../services/playerService.js");

describe("playerController", () => {
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

  describe("createPlayer", () => {
    test("should create player successfully", async () => {
      req = { body: { name: "John Doe" } };
      const response = { id: 1, name: "John Doe" };
      playerService.savePlayer.mockResolvedValue(response);

      await playerController.createPlayer(req, res, next);

      expect(playerService.savePlayer).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    test("should return 400 if data incomplete", async () => {
      req = { body: {} };

      await playerController.createPlayer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "All fields must be completed",
      });
      expect(playerService.savePlayer).not.toHaveBeenCalled();
    });

    test("should call next on service error", async () => {
      req = { body: { name: "John Doe" } };
      playerService.savePlayer.mockRejectedValue(new Error("DB error"));

      await playerController.createPlayer(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getPlayers", () => {
    test("should get all players successfully", async () => {
      req = {};
      const players = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      playerService.getPlayers.mockResolvedValue(players);

      await playerController.getPlayers(req, res, next);

      expect(playerService.getPlayers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(players);
    });

    test("should call next on error", async () => {
      playerService.getPlayers.mockRejectedValue(new Error("DB error"));
      await playerController.getPlayers(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getByIdPlayer", () => {
    test("should get player by id", async () => {
      req = { params: { id: "1" } };
      const player = { id: 1, name: "John" };
      playerService.getByIdPlayer.mockResolvedValue(player);

      await playerController.getByIdPlayer(req, res, next);

      expect(playerService.getByIdPlayer).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(player);
    });

    test("should call next on error", async () => {
      req = { params: { id: "1" } };
      playerService.getByIdPlayer.mockRejectedValue(new Error("DB error"));

      await playerController.getByIdPlayer(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("updateFullPlayer", () => {
    test("should update player successfully", async () => {
      req = { params: { id: "1" }, body: { name: "Updated Name" } };
      const updated = { id: 1, name: "Updated Name" };
      playerService.updateFullPlayer.mockResolvedValue(updated);

      await playerController.updateFullPlayer(req, res, next);

      expect(playerService.updateFullPlayer).toHaveBeenCalledWith(
        req.body,
        "1"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    test("should return 400 if update data incomplete", async () => {
      req = { params: { id: "1" }, body: {} };

      await playerController.updateFullPlayer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "All fields must be completed",
      });
      expect(playerService.updateFullPlayer).not.toHaveBeenCalled();
    });

    test("should call next on service error", async () => {
      req = { params: { id: "1" }, body: { name: "Updated" } };
      playerService.updateFullPlayer.mockRejectedValue(new Error("DB error"));

      await playerController.updateFullPlayer(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("deletePlayer", () => {
    test("should delete player successfully", async () => {
      req = { params: { id: "1" } };
      playerService.deletePlayer.mockResolvedValue();

      await playerController.deletePlayer(req, res, next);

      expect(playerService.deletePlayer).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    test("should call next on error", async () => {
      req = { params: { id: "1" } };
      playerService.deletePlayer.mockRejectedValue(new Error("DB error"));

      await playerController.deletePlayer(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("patchPlayer", () => {
    test("should patch player successfully", async () => {
      req = { params: { id: "1" }, body: { name: "Patched Name" } };
      const patched = { id: 1, name: "Patched Name" };
      playerService.patchPlayer.mockResolvedValue(patched);

      await playerController.patchPlayer(req, res, next);

      expect(playerService.patchPlayer).toHaveBeenCalledWith(req.body, "1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(patched);
    });
  });

  describe("getPlayerByToken", () => {
    test("should return player by token", async () => {
      req = { user: { playerId: "1" } };
      const player = { id: 1, name: "TokenUser" };
      playerService.getByIdByToken.mockResolvedValue(player);

      await playerController.getPlayerByToken(req, res, next);

      expect(playerService.getByIdByToken).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(player);
    });

    test("should return 400 if no playerId in token", async () => {
      req = { user: {} };

      await playerController.getPlayerByToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Player ID is required",
      });
      expect(playerService.getByIdByToken).not.toHaveBeenCalled();
    });
  });
});
