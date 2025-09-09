import { MatchRepository } from "../../repository/matchRepository.js";
import db from "../../models/index.js";
import Either from "../../utils/Either.js";

jest.mock("../../models/index.js", () => ({
  match: {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  },
  player: {},
}));

describe("MatchRepository", () => {
  let repository;

  beforeEach(() => {
    repository = new MatchRepository();
    jest.clearAllMocks();
  });

  describe("saveUserMatch", () => {
    test("should create a new match", async () => {
      const mockData = { id_game: 1, id_player: 1 };
      const mockReturn = { id: 1, ...mockData };
      db.match.create.mockResolvedValue(mockReturn);

      const result = await repository.saveUserMatch(mockData);
      expect(db.match.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(Either.right(mockReturn));
    });
  });

  describe("changeStatus", () => {
    test("should update the status for a specific player", async () => {
      const newData = { status: "active" };
      db.match.update.mockResolvedValue([1]);

      const result = await repository.changeStatus(newData, 1, 2);
      expect(db.match.update).toHaveBeenCalledWith(newData, {
        where: { id_game: 1, id_player: 2 },
      });
      expect(result).toEqual(Either.right([1]));
    });
  });

  describe("changeStatusAllPlayers", () => {
    test("should update status for all players in a game", async () => {
      const newData = { status: "finished" };
      db.match.update.mockResolvedValue([3]);

      const result = await repository.changeStatusAllPlayers(newData, 1);
      expect(db.match.update).toHaveBeenCalledWith(newData, {
        where: { id_game: 1 },
      });
      expect(result).toEqual(Either.right([3]));
    });
  });

  describe("getPlayers", () => {
    test("should return all players for a game", async () => {
      const mockPlayers = [{ id: 1, player: { username: "Alice" } }];
      db.match.findAll.mockResolvedValue(mockPlayers);

      const result = await repository.getPlayers(1);
      expect(db.match.findAll).toHaveBeenCalledWith({
        where: { id_game: 1 },
        include: {
          model: db.player,
          attributes: ["username"],
        },
      });
      expect(result).toEqual(Either.right(mockPlayers));
    });
  });

  describe("findOne", () => {
    test("should return a specific match", async () => {
      const mockMatch = { id: 1, id_game: 1, id_player: 2 };
      db.match.findOne.mockResolvedValue(mockMatch);

      const result = await repository.findOne(1, 2);
      expect(db.match.findOne).toHaveBeenCalledWith({
        where: { id_game: 1, id_player: 2 },
      });
      expect(result).toEqual(Either.right(mockMatch));
    });
  });

  describe("count", () => {
    test("should return the number of matches in a game", async () => {
      db.match.count.mockResolvedValue(5);

      const result = await repository.count(1);
      expect(db.match.count).toHaveBeenCalledWith({
        where: { id_game: 1 },
      });
      expect(result).toEqual(Either.right(5));
    });
  });

  describe("listUser", () => {
    test("should list all matches for a game", async () => {
      const mockMatches = [{ id: 1 }, { id: 2 }];
      db.match.findAll.mockResolvedValue(mockMatches);

      const result = await repository.listUser(1);
      expect(db.match.findAll).toHaveBeenCalledWith({
        where: { id_game: 1 },
      });
      expect(result).toEqual(Either.right(mockMatches));
    });
  });

  describe("getPlayersAsc", () => {
    test("should return players ordered by turn ascending", async () => {
      const mockPlayers = [
        { turn: 1, player: { username: "Alice" } },
        { turn: 2, player: { username: "Bob" } },
      ];
      db.match.findAll.mockResolvedValue(mockPlayers);

      const result = await repository.getPlayersAsc(1);
      expect(db.match.findAll).toHaveBeenCalledWith({
        where: { id_game: 1 },
        order: [["turn", "ASC"]],
        include: { model: db.player, attributes: ["username"] },
      });
      expect(result).toEqual(Either.right(mockPlayers));
    });

    test("should return left if no players found", async () => {
      db.match.findAll.mockResolvedValue([]);
      const result = await repository.getPlayersAsc(1);
      expect(result).toEqual(Either.left({ message: "No players found for game 1", statusCode: 404 }));
    });
  });

  describe("getPlayersDesc", () => {
    test("should return players ordered by turn descending", async () => {
      const mockPlayers = [
        { turn: 2, player: { username: "Bob" } },
        { turn: 1, player: { username: "Alice" } },
      ];
      db.match.findAll.mockResolvedValue(mockPlayers);

      const result = await repository.getPlayersDesc(1);
      expect(db.match.findAll).toHaveBeenCalledWith({
        where: { id_game: 1 },
        order: [["turn", "DESC"]],
        include: { model: db.player, attributes: ["username"] },
      });
      expect(result).toEqual(Either.right(mockPlayers));
    });

    test("should return left if no players found", async () => {
      db.match.findAll.mockResolvedValue([]);
      const result = await repository.getPlayersDesc(1);
      expect(result).toEqual(Either.left({ message: "No players found for game 1", statusCode: 404 }));
    });
  });

  describe("getPlayersId", () => {
    test("should return players with their ids", async () => {
      const mockPlayers = [{ id: 1, player: { username: "Alice" } }];
      db.match.findAll.mockResolvedValue(mockPlayers);

      const result = await repository.getPlayersId(1);
      expect(db.match.findAll).toHaveBeenCalledWith({
        where: { id_game: 1 },
        include: { model: db.player, attributes: ["id", "username"] },
      });
      expect(result).toEqual(Either.right(mockPlayers));
    });

    test("should return left if no players found", async () => {
      db.match.findAll.mockResolvedValue([]);
      const result = await repository.getPlayersId(1);
      expect(result).toEqual(Either.left({ message: "No players found for game 1", statusCode: 404 }));
    });
  });
});