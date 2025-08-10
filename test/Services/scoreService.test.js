import * as scoreService from "../../services/scoreService.js";
import score from "../../models/score";

jest.mock("../../models/score");

describe("should create score", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create score successfully", async () => {
    score.create.mockResolvedValue({ id: 1 });
    const scoreData = { playerId: 1, gameId: 1, score: 100 };

    const result = await scoreService.saveScore(scoreData);

    expect(score.create).toHaveBeenCalledWith(scoreData);
    expect(result).toEqual({ id: 1 });
  });

  test("should throw error if create fails", async () => {
    score.create.mockRejectedValue(new Error("DB failure"));
    const scoreData = { playerId: 1, gameId: 1, score: 100 };

    await expect(scoreService.saveScore(scoreData)).rejects.toThrow(
      "Error creating score: DB failure"
    );
  });
});

describe("getAllScore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return all scores", async () => {
    score.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await scoreService.getAllScore();

    expect(score.findAll).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test("should throw error if findAll fails", async () => {
    score.findAll.mockRejectedValue(new Error("DB error"));

    await expect(scoreService.getAllScore()).rejects.toThrow(
      "Error score cannot be obtained: DB error"
    );
  });
});

describe("getById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return score by id", async () => {
    score.findByPk.mockResolvedValue({ id: 1 });

    const result = await scoreService.getById(1);

    expect(score.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  test("should throw error if findByPk fails", async () => {
    score.findByPk.mockRejectedValue(new Error("Not found"));

    await expect(scoreService.getById(1)).rejects.toThrow(
      "The score with 1 not exists"
    );
  });
});

describe("updateAll", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should update score successfully", async () => {
    const mockSave = jest.fn().mockResolvedValue({ id: 1, score: 200 });
    const mockScoreInstance = {
      save: mockSave,
      // Para que Object.assign funcione, podemos tener las propiedades iniciales:
      id: 1,
      score: 100,
    };
    score.findByPk.mockResolvedValue(mockScoreInstance);

    const newData = { score: 200 };
    const result = await scoreService.updateAll(newData, 1);

    expect(score.findByPk).toHaveBeenCalledWith(1);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, score: 200 });
  });

  test("should throw error if score not found", async () => {
    score.findByPk.mockResolvedValue(null);

    await expect(scoreService.updateAll({}, 1)).rejects.toThrow(
      "The score with 1 not exists"
    );
  });

  test("should throw error if update fails", async () => {
    score.findByPk.mockResolvedValue({
      id: 1,
      save: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await expect(scoreService.updateAll({}, 1)).rejects.toThrow(
      "Score cannot be update: DB error"
    );
  });
});

describe("deleteById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should delete score successfully", async () => {
    score.findByPk.mockResolvedValue({
      id: 1,
      destroy: jest.fn().mockResolvedValue(),
    });

    await scoreService.deleteById(1);

    expect(score.findByPk).toHaveBeenCalledWith(1);
  });

  test("should throw error if score not found", async () => {
    score.findByPk.mockResolvedValue(null);

    await expect(scoreService.deleteById(1)).rejects.toThrow(
      "The score with 1 not exists"
    );
  });

  test("should throw error if delete fails", async () => {
    score.findByPk.mockResolvedValue({
      id: 1,
      destroy: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await expect(scoreService.deleteById(1)).rejects.toThrow(
      "Error deleting score: DB error"
    );
  });
});

describe("patchScore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should patch score successfully", async () => {
    const newData = { score: 200 };
    const mockUpdate = jest.fn().mockResolvedValue({ id: 1, ...newData });
    const mockScoreInstance = {
      update: mockUpdate,
      id: 1,
    };
    score.findByPk.mockResolvedValue(mockScoreInstance);

    const result = await scoreService.patchScore(newData, 1);

    expect(score.findByPk).toHaveBeenCalledWith(1);
    expect(mockUpdate).toHaveBeenCalledWith(newData);
    expect(result).toEqual({ id: 1, score: 200 });
  });

  test("should throw error if score not found", async () => {
    score.findByPk.mockResolvedValue(null);

    await expect(scoreService.patchScore({}, 1)).rejects.toThrow(
      "The score with 1 not exists"
    );
  });

  test("should throw error if patch fails", async () => {
    score.findByPk.mockResolvedValue({
      id: 1,
      update: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await expect(scoreService.patchScore({}, 1)).rejects.toThrow(
      "Error update score: DB error"
    );
  });
});
