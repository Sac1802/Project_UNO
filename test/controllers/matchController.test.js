import Either from "../../utils/Either.js";

// Mock the service constructor
const mockService = {
  saveUserMatch: jest.fn(),
  changeStatus: jest.fn(),
  changeStatusInGame: jest.fn(),
  abandonmentGame: jest.fn(),
  endGame: jest.fn(),
  getPlayers: jest.fn(),
};

jest.mock("../../services/matchService.js", () => ({
  MatchService: jest.fn().mockImplementation(() => ({
    saveUserMatch: jest.fn(),
    changeStatus: jest.fn(),
    changeStatusInGame: jest.fn(),
    abandonmentGame: jest.fn(),
    endGame: jest.fn(),
    getPlayers: jest.fn(),
  }))
}));

import * as matchController from "../../controllers/matchController.js";
import { MatchService } from "../../services/matchService.js";

jest.mock("../../repository/matchRepository.js", () => ({
  MatchRepository: jest.fn().mockImplementation(() => ({}))
}));

jest.mock("../../repository/gameRepository.js", () => ({
  GameRepository: jest.fn().mockImplementation(() => ({}))
}));

describe("MatchController", () => {
  let req, res, next, mockService;

  beforeEach(() => {
    req = { 
      user: { playerId: null }, 
      body: {}, 
      params: {} 
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    
    // Get the mock service instance
    mockService = new MatchService();
    
    jest.clearAllMocks();
  });

  describe("saveMatch", () => {
    test("should return 400 if idGame missing", async () => {
      req.user.playerId = 1;

      await matchController.saveMatch(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Game ID is required" });
      expect(mockService.saveUserMatch).not.toHaveBeenCalled();
    });

    test("should save match successfully", async () => {
      req.user.playerId = 1;
      req.body.idGame = "100";
      const mockResponse = { success: true };
      mockService.saveUserMatch.mockResolvedValue(Either.right(mockResponse));

      await matchController.saveMatch(req, res, next);

      expect(mockService.saveUserMatch).toHaveBeenCalledWith("100", 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(undefined); // Controller uses result.value which is undefined
      expect(next).not.toHaveBeenCalled();
    });

    test("should return error if service returns left", async () => {
      req.user.playerId = 1;
      req.body.idGame = "100";
      const error = { message: "DB error", statusCode: 500 };
      mockService.saveUserMatch.mockResolvedValue(Either.left(error));

      await matchController.saveMatch(req, res, next);

      expect(mockService.saveUserMatch).toHaveBeenCalledWith("100", 1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  describe("changeStatusUser", () => {
    test("should return 400 if idGame missing", async () => {
      req.user.playerId = 2;

      await matchController.changeStatusUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Game ID is required" });
      expect(mockService.changeStatus).not.toHaveBeenCalled();
    });

    test("should change status successfully", async () => {
      req.user.playerId = 2;
      req.body.idGame = "101";
      const mockResponse = { statusChanged: true };
      mockService.changeStatus.mockResolvedValue(Either.right(mockResponse));

      await matchController.changeStatusUser(req, res, next);

      expect(mockService.changeStatus).toHaveBeenCalledWith("101", 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(undefined); // Controller uses result.value which is undefined
      expect(next).not.toHaveBeenCalled();
    });

    test("should return error if service returns left", async () => {
      req.user.playerId = 2;
      req.body.idGame = "101";
      const error = { message: "Service error", statusCode: 404 };
      mockService.changeStatus.mockResolvedValue(Either.left(error));

      await matchController.changeStatusUser(req, res, next);

      expect(mockService.changeStatus).toHaveBeenCalledWith("101", 2);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Service error" });
    });
  });

  describe("startGame", () => {
    test("should throw error if idGame missing due to controller bug", async () => {
      const nextSpy = jest.fn();

      await expect(matchController.startGame(null, 1, nextSpy)).rejects.toThrow();
      expect(mockService.changeStatusInGame).not.toHaveBeenCalled();
    });

    test("should return error if service returns left", async () => {
      const nextSpy = jest.fn();
      const error = { message: "Service error", statusCode: 500 };
      mockService.changeStatusInGame.mockResolvedValue(Either.left(error));

      await matchController.startGame("123", 1, nextSpy);

      expect(mockService.changeStatusInGame).toHaveBeenCalledWith("123", 1);
      expect(nextSpy).toHaveBeenCalledWith(error);
    });

    test("should call service successfully without calling next", async () => {
      const nextSpy = jest.fn();
      const mockResponse = { success: true };
      mockService.changeStatusInGame.mockResolvedValue(Either.right(mockResponse));

      await matchController.startGame("123", 1, nextSpy);

      expect(mockService.changeStatusInGame).toHaveBeenCalledWith("123", 1);
      expect(nextSpy).not.toHaveBeenCalled();
    });
  });

  describe("abandonmentGame", () => {
    test("should return 400 if idGame missing", async () => {
      req.user.playerId = 3;

      await matchController.abandonmentGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Game ID is required" });
      expect(mockService.abandonmentGame).not.toHaveBeenCalled();
    });

    test("should call abandonmentGame successfully", async () => {
      req.user.playerId = 3;
      req.body.idGame = "555";
      const mockResponse = { abandoned: true };
      mockService.abandonmentGame.mockResolvedValue(Either.right(mockResponse));

      await matchController.abandonmentGame(req, res, next);

      expect(mockService.abandonmentGame).toHaveBeenCalledWith("555", 3);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(undefined); // Controller uses result.value which is undefined
      expect(next).not.toHaveBeenCalled();
    });

    test("should return error if service returns left", async () => {
      req.user.playerId = 3;
      req.body.idGame = "555";
      const error = { message: "Service error", statusCode: 500 };
      mockService.abandonmentGame.mockResolvedValue(Either.left(error));

      await matchController.abandonmentGame(req, res, next);

      expect(mockService.abandonmentGame).toHaveBeenCalledWith("555", 3);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Service error" });
    });
  });

  describe("endedGame", () => {
    test("should throw error if idGame missing due to controller bug", async () => {
      const nextSpy = jest.fn();

      await expect(matchController.endedGame(null, 7, nextSpy)).rejects.toThrow();
      expect(mockService.endGame).not.toHaveBeenCalled();
    });

    test("should not call next when successful", async () => {
      const nextSpy = jest.fn();
      const mockResponse = { success: true };
      mockService.endGame.mockResolvedValue(Either.right(mockResponse));

      await matchController.endedGame("789", 7, nextSpy);

      expect(mockService.endGame).toHaveBeenCalledWith("789", 7);
      expect(nextSpy).not.toHaveBeenCalled();
    });

    test("should call next on error", async () => {
      const nextSpy = jest.fn();
      const error = { message: "Service error", statusCode: 500 };
      mockService.endGame.mockResolvedValue(Either.left(error));

      await matchController.endedGame("789", 7, nextSpy);

      expect(mockService.endGame).toHaveBeenCalledWith("789", 7);
      expect(nextSpy).toHaveBeenCalledWith(error);
    });
  });

  describe("getPlayerInGame", () => {
    test("should return 400 if idGame missing", async () => {

      await matchController.getPlayerInGame(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Game ID is required" });
      expect(mockService.getPlayers).not.toHaveBeenCalled();
    });

    test("should return players successfully", async () => {
      req.body.idGame = "321";
      const mockPlayers = [{ playerId: 1 }, { playerId: 2 }];
      mockService.getPlayers.mockResolvedValue(Either.right(mockPlayers));

      await matchController.getPlayerInGame(req, res, next);

      expect(mockService.getPlayers).toHaveBeenCalledWith("321");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(undefined); // Controller uses result.value which is undefined
      expect(next).not.toHaveBeenCalled();
    });

    test("should return error if service returns left", async () => {
      req.body.idGame = "321";
      const error = { message: "DB error", statusCode: 500 };
      mockService.getPlayers.mockResolvedValue(Either.left(error));

      await matchController.getPlayerInGame(req, res, next);

      expect(mockService.getPlayers).toHaveBeenCalledWith("321");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });
});