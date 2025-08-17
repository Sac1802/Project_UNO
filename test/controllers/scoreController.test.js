import * as scoreController from "../../controllers/scoreController.js";
import { ScoreService } from "../../services/scoreService.js";

jest.mock("../../services/scoreService.js");

jest.mock("../../repository/ScoreRepository.js");

describe("ScoreController", () => {
  let req, res, next;

  beforeEach(() => {
    req = { 
      body: {}, 
      params: {} 
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
    
    jest.clearAllMocks();
  });

  describe("saveScore", () => {
    test("should return 400 if validation fails", async () => {
      req.body = { points: "" };

      await scoreController.saveScore(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "All fields must be completed" 
      });
      expect(ScoreService.prototype.saveScore).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 if data has null values", async () => {
      req.body = { points: 100, playerId: null };

      await scoreController.saveScore(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "All fields must be completed" 
      });
      expect(ScoreService.prototype.saveScore).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 201 if score saved successfully", async () => {
      req.body = { points: 100, playerId: "123" };
      const savedScore = { id: 1, points: 100, playerId: "123" };
      ScoreService.prototype.saveScore.mockResolvedValue(savedScore);

      await scoreController.saveScore(req, res, next);

      expect(ScoreService.prototype.saveScore).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedScore);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("getAllScore", () => {
    test("should return 200 with all scores", async () => {
      const scores = [
        { id: 1, points: 100, playerId: "123" },
        { id: 2, points: 200, playerId: "456" }
      ];
      ScoreService.prototype.getAllScore.mockResolvedValue(scores);

      await scoreController.getAllScore(req, res, next);

      expect(ScoreService.prototype.getAllScore).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(scores);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    test("should return 200 with score by id", async () => {
      req.params.id = "1";
      const score = { id: 1, points: 100, playerId: "123" };
      ScoreService.prototype.getById.mockResolvedValue(score);

      await scoreController.getById(req, res, next);

      expect(ScoreService.prototype.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(score);
      expect(next).not.toHaveBeenCalled();
    });

  });

  describe("updateAllScore", () => {
    test("should return 400 if validation fails", async () => {
      req.body = { points: "" };
      req.params.id = "1";

      await scoreController.updateAllScore(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "All fields must be completed" 
      });
      expect(ScoreService.prototype.updateAll).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 200 if score updated successfully", async () => {
      req.body = { points: 200, playerId: "123" };
      req.params.id = "1";
      const updatedScore = { id: 1, points: 200, playerId: "123" };
      ScoreService.prototype.updateAll.mockResolvedValue(updatedScore);

      await scoreController.updateAllScore(req, res, next);

      expect(ScoreService.prototype.updateAll).toHaveBeenCalledWith(req.body, "1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedScore);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("deleteById", () => {
    test("should return 204 on successful deletion", async () => {
      req.params.id = "1";
      ScoreService.prototype.deleteById.mockResolvedValue();

      await scoreController.deleteById(req, res, next);

      expect(ScoreService.prototype.deleteById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("patchScore", () => {
    test("should return 200 when score patched successfully", async () => {
      req.body = { points: 150 };
      req.params.id = "1";
      const patchedScore = { id: 1, points: 150, playerId: "123" };
      ScoreService.prototype.patchScore.mockResolvedValue(patchedScore);

      await scoreController.patchScore(req, res, next);

      expect(ScoreService.prototype.patchScore).toHaveBeenCalledWith(req.body, "1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(patchedScore);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("getScoreAllPlayer", () => {
    test("should return 400 if idGame is missing", async () => {
      req.body = {};

      await scoreController.getScoreAllPlayer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Game ID is required" 
      });
      expect(ScoreService.prototype.scoreAllPlayers).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 200 with scores for all players", async () => {
      req.body = { idGame: "game1" };
      const gameScores = {
        game_id: "game1",
        score: [
          { username: "player1", score: 100 },
          { username: "player2", score: 200 }
        ]
      };
      ScoreService.prototype.scoreAllPlayers.mockResolvedValue(gameScores);

      await scoreController.getScoreAllPlayer(req, res, next);

      expect(ScoreService.prototype.scoreAllPlayers).toHaveBeenCalledWith("game1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(gameScores);
      expect(next).not.toHaveBeenCalled();
    });
  });
});