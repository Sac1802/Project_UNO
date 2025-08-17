import { ScoreService } from "../../services/scoreService.js";
import { ScoreRepository } from "../../repository/ScoreRepository.js";
import Either from "../../utils/Either.js";

jest.mock("../../repository/ScoreRepository.js");

describe("ScoreService", () => {
  let scoreService;
  let mockScoreRepository;

  beforeEach(() => {
    mockScoreRepository = {
      saveScore: jest.fn(),
      getAllScore: jest.fn(),
      getById: jest.fn(),
      updateAll: jest.fn(),
      deleteById: jest.fn(),
      patchScore: jest.fn(),
    };

    ScoreRepository.mockImplementation(() => mockScoreRepository);
    scoreService = new ScoreService(mockScoreRepository);
    jest.clearAllMocks();
  });

  describe("saveScore", () => {
    test("should create score successfully", async () => {
      const scoreData = { playerId: 1, gameId: 1, score: 100 };
      const savedScore = Either.right({ id: 1, ...scoreData });

      mockScoreRepository.saveScore.mockResolvedValue(savedScore);

      const result = await scoreService.saveScore(scoreData);

      expect(result.isRight()).toBe(true);
      expect(result.getOrElse({})).toEqual({
        message: "Score registered successfully",
        score: { id: 1, ...scoreData },
      });
    });

    test("should return left if creation fails", async () => {
      const scoreData = { playerId: 1, gameId: 1, score: 100 };
      const savedScore = Either.left({ error: "DB failure" });

      mockScoreRepository.saveScore.mockResolvedValue(savedScore);

      const result = await scoreService.saveScore(scoreData);

      expect(result.isLeft()).toBe(true);
      expect(result.getError()).toEqual({
        message: "Score could not be created",
        statusCode: 500,
      });
    });
  });

  describe("getAllScore", () => {
    test("should return all scores", async () => {
      const mockScores = [{ id: 1 }, { id: 2 }];
      mockScoreRepository.getAllScore.mockResolvedValue(Either.right(mockScores));

      const result = await scoreService.getAllScore();

      expect(result.isRight()).toBe(true);
      expect(result.getOrElse([])).toEqual(mockScores);
    });

    test("should return left if findAll fails", async () => {
      mockScoreRepository.getAllScore.mockResolvedValue(Either.left({ error: "DB error" }));

      const result = await scoreService.getAllScore();

      expect(result.isLeft()).toBe(true);
      expect(result.getError()).toEqual({
        message: "Scores cannot be obtained",
        statusCode: 404,
      });
    });
  });

  describe("getById", () => {
    test("should return score by id", async () => {
      const scoreData = { id: 1, score: 100 };
      mockScoreRepository.getById.mockResolvedValue(Either.right(scoreData));

      const result = await scoreService.getById(1);

      expect(result.isRight()).toBe(true);
      expect(result.getOrElse({})).toEqual(scoreData);
    });

    test("should return left if score not found", async () => {
      mockScoreRepository.getById.mockResolvedValue(Either.left({ error: "Not found" }));

      const result = await scoreService.getById(1);

      expect(result.isLeft()).toBe(true);
      expect(result.getError()).toEqual({
        message: "The score with id 1 does not exist",
        statusCode: 404,
      });
    });
  });

  describe("updateAll", () => {
    test("should update score successfully", async () => {
      const newData = { score: 200 };
      const existingScore = Either.right({ id: 1, score: 100 });
      const updatedScore = Either.right({ id: 1, score: 200 });

      mockScoreRepository.getById.mockResolvedValue(existingScore);
      mockScoreRepository.updateAll.mockResolvedValue(updatedScore);

      const result = await scoreService.updateAll(newData, 1);

      expect(result.isRight()).toBe(true);
      expect(result.getOrElse({})).toEqual({ id: 1, score: 200 });
    });

    test("should return left if score not found", async () => {
      mockScoreRepository.getById.mockResolvedValue(Either.left({ error: "Not found" }));

      const result = await scoreService.updateAll({}, 1);

      expect(result.isLeft()).toBe(true);
      expect(result.getError()).toEqual({
        message: "The score with id 1 does not exist",
        statusCode: 404,
      });
    });

    test("should return left if update fails", async () => {
      const existingScore = Either.right({ id: 1, score: 100 });
      const updateFailure = Either.left({ error: "DB error" });

      mockScoreRepository.getById.mockResolvedValue(existingScore);
      mockScoreRepository.updateAll.mockResolvedValue(updateFailure);

      const result = await scoreService.updateAll({}, 1);

      expect(result.isLeft()).toBe(true);
      expect(result.getError()).toEqual({
        message: "Score cannot be updated",
        statusCode: 500,
      });
    });
  });

  describe("deleteById", () => {
    test("should delete score successfully", async () => {
      mockScoreRepository.getById.mockResolvedValue(Either.right({ id: 1, score: 100 }));
      mockScoreRepository.deleteById.mockResolvedValue(Either.right({ message: "Deleted" }));

      const result = await scoreService.deleteById(1);

      expect(result.isRight()).toBe(true);
      expect(result.getOrElse({})).toEqual({ message: "Score deleted successfully" });
    });

    test("should return left if score not found", async () => {
      mockScoreRepository.getById.mockResolvedValue(Either.left({ error: "Not found" }));

      const result = await scoreService.deleteById(1);

      expect(result.isLeft()).toBe(true);
      expect(result.getError()).toEqual({
        message: "The score with id 1 does not exist",
        statusCode: 404,
      });
    });

    test("should return left if delete fails", async () => {
      mockScoreRepository.getById.mockResolvedValue(Either.right({ id: 1, score: 100 }));
      mockScoreRepository.deleteById.mockResolvedValue(Either.left({ error: "DB error" }));

      const result = await scoreService.deleteById(1);

      expect(result.isLeft()).toBe(true);
      expect(result.getError()).toEqual({
        message: "Error deleting score",
        statusCode: 500,
      });
    });
  });

  describe("patchScore", () => {
    test("should patch score successfully", async () => {
      const existingScore = Either.right({ id: 1, score: 100 });
      const patchedScore = Either.right({ id: 1, score: 200 });

      mockScoreRepository.getById.mockResolvedValue(existingScore);
      mockScoreRepository.patchScore.mockResolvedValue(patchedScore);

      const result = await scoreService.patchScore({ score: 200 }, 1);

      expect(result.isRight()).toBe(true);
      expect(result.getOrElse({})).toEqual({ id: 1, score: 200 });
    });

    test("should return left if score not found", async () => {
      mockScoreRepository.getById.mockResolvedValue(Either.left({ error: "Not found" }));

      const result = await scoreService.patchScore({}, 1);

      expect(result.isLeft()).toBe(true);
      expect(result.getError()).toEqual({
        message: "The score with id 1 does not exist",
        statusCode: 404,
      });
    });
  });

  describe("scoreAllPlayers", () => {
    test("should return scores for all players in a game", async () => {
      const idGame = 1;
      const mockScoresWithPlayers = [
        { score: 100, player: { username: "player1" } },
        { score: 200, player: { username: "player2" } }
      ];

      mockScoreRepository.getAllScore.mockResolvedValue(Either.right(mockScoresWithPlayers));

      const result = await scoreService.scoreAllPlayers(idGame);

      expect(result.isRight()).toBe(true);
      expect(result.getOrElse({})).toEqual({
        game_id: idGame,
        score: [
          { username: "player1", score: 100 },
          { username: "player2", score: 200 }
        ]
      });
    });

    test("should return left if no scores found", async () => {
      const idGame = 1;
      mockScoreRepository.getAllScore.mockResolvedValue(Either.left({ error: "No scores" }));

      const result = await scoreService.scoreAllPlayers(idGame);

      expect(result.isLeft()).toBe(true);
      expect(result.getError()).toEqual({
        message: "The game with id 1 has no scores",
        statusCode: 404,
      });
    });
  });
});
