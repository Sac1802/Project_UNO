jest.mock("../../models/games.js", () => ({
  findByPk: jest.fn(),
}));

jest.mock("../../models/match.js", () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
}));

import * as game from "../../models/games.js";
import * as match from "../../models/match.js";
import * as matchService from "../../services/matchService.js";
import player from "../../models/player.js";


describe("matchService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveUserMatch", () => {
    test("returns message if game does not exist", async () => {
      game.findByPk.mockResolvedValue(null);
      const response = await matchService.saveUserMatch(10, 5);
      expect(response).toEqual({ message: "Game not found" });
    });

    test("returns message if game is full", async () => {
      game.findByPk.mockResolvedValue({ max_players: 2 });
      match.count.mockResolvedValue(2);
      const response = await matchService.saveUserMatch(10, 5);
      expect(response).toEqual({ message: "Full game" });
    });

    test("creates a new match entry if user is not already registered", async () => {
      game.findByPk.mockResolvedValue({ max_players: 3 });
      match.count.mockResolvedValue(1);
      match.findOne.mockResolvedValue(null);
      match.create.mockResolvedValue({
        id_game: 10,
        id_player: 5,
        status: "wait",
      });

      const response = await matchService.saveUserMatch(10, 5);

      expect(match.create).toHaveBeenCalledWith({
        id_game: 10,
        id_player: 5,
        status: "wait",
      });
      expect(response).toEqual({
        message: "User joined the game successfully",
      });
    });

    test("returns message if user is already registered", async () => {
      game.findByPk.mockResolvedValue({ max_players: 3 });
      match.count.mockResolvedValue(1);
      match.findOne.mockResolvedValue({ id: 1 });

      const response = await matchService.saveUserMatch(10, 5);
      expect(response).toEqual({
        message: "The user is already registered for this game",
      });
    });

    test("handles error", async () => {
      game.findByPk.mockRejectedValue(new Error("DB error"));
      const response = await matchService.saveUserMatch(10, 5);
      expect(response.message).toBe("An error occurred while joining the game");
      expect(response.error).toBe("DB error");
    });

    test("endGame handles error correctly", async () => {
      game.findByPk.mockRejectedValue(new Error("DB error"));

      const response = await matchService.endGame(10, 5);

      expect(response).toEqual({
        message: "An error occurred while changing the status of all users ",
        error: "DB error",
      });
    });
  });

  describe("changeStatus", () => {
    test("returns error if user not found", async () => {
      match.findOne.mockResolvedValue(null);
      const response = await matchService.changeStatus(10, 5);
      expect(response.message).toBe(
        "An error occurred while changing the status of the user"
      );
      expect(response.error).toBe("The user or game id does not exist");
    });

    test("updates status to ready", async () => {
      const mockUpdate = jest.fn().mockResolvedValue({});
      match.findOne.mockResolvedValue({ update: mockUpdate });
      const response = await matchService.changeStatus(10, 5);
      expect(mockUpdate).toHaveBeenCalledWith({ status: "ready" });
      expect(response.message).toBe(
        "User status changed to ready successfully"
      );
    });

    test("handles error on update", async () => {
      match.findOne.mockRejectedValue(new Error("DB error"));
      const response = await matchService.changeStatus(10, 5);
      expect(response.message).toBe(
        "An error occurred while changing the status of the user"
      );
      expect(response.error).toBe("DB error");
    });
  });

  describe("changeStatusInGame", () => {
    test("only allows the game owner to start the game", async () => {
      game.findByPk.mockResolvedValue({ game_owner: 99 });
      const response = await matchService.changeStatusInGame(10, 5);
      expect(response).toEqual({
        message: "Only the owner of the game can start the game",
      });
    });

    test("throws error if no players found in the game", async () => {
      game.findByPk.mockResolvedValue({ game_owner: 5 });
      match.findAll.mockResolvedValue([]);
      const response = await matchService.changeStatusInGame(10, 5);
      expect(response).toEqual({
        error: "the game id does not exist",
        message: "An error occurred while changing the status of all users ",
      });
    });

    test("updates all users status to inGame", async () => {
      game.findByPk.mockResolvedValue({ game_owner: 5 });
      match.findAll.mockResolvedValue([{}, {}]);
      match.update.mockResolvedValue([2]);
      const response = await matchService.changeStatusInGame(10, 5);
      expect(match.update).toHaveBeenCalledWith(
        { status: "inGame" },
        { where: { id_game: 10 } }
      );
      expect(response.message).toBe("Game started successfully");
    });

    test("handles error", async () => {
      game.findByPk.mockRejectedValue(new Error("DB error"));
      const response = await matchService.changeStatusInGame(10, 5);
      expect(response.message).toBe(
        "An error occurred while changing the status of all users "
      );
      expect(response.error).toBe("DB error");
    });
  });

  describe("abandonmentGame", () => {
    test("returns message if the game does not exist", async () => {
      game.findByPk.mockResolvedValue(null);
      const response = await matchService.abandonmentGame(10, 5);
      expect(response).toEqual({ message: "Game not found" });
    });

    test("returns message if game not started or user not in-game", async () => {
      game.findByPk.mockResolvedValue({ status: "waiting" });
      match.findOne.mockResolvedValue({ status: "wait" });
      const response = await matchService.abandonmentGame(10, 5);
      expect(response).toEqual({
        message: "The game has not started or has alredy ended",
      });
    });

    test("updates status to abandonment", async () => {
      game.findByPk.mockResolvedValue({ status: "in_progress" });
      match.findOne.mockResolvedValue({ status: "inGame" });
      match.update.mockResolvedValue([1]);
      const response = await matchService.abandonmentGame(10, 5);
      expect(match.update).toHaveBeenCalledWith(
        { status: "abandonment" },
        { where: { id_game: 10, id_player: 5 } }
      );
      expect(response).toEqual({ message: "User left the game successfully" });
    });

    test("returns message if no rows affected on update", async () => {
      game.findByPk.mockResolvedValue({ status: "in_progress" });
      match.findOne.mockResolvedValue({ status: "inGame" });
      match.update.mockResolvedValue([0]);
      const response = await matchService.abandonmentGame(10, 5);
      expect(response).toEqual({
        message: "User not found in this game or already left",
      });
    });

    test("handles error", async () => {
      game.findByPk.mockRejectedValue(new Error("DB error"));
      const response = await matchService.abandonmentGame(10, 5);
      expect(response.message).toBe(
        "An error occurred while abandoning the game"
      );
      expect(response.error).toBe("DB error");
    });
  });
});

describe("getPlayers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns players list for valid game", async () => {
    game.findByPk.mockResolvedValue({ id: 10 });

    match.findAll.mockResolvedValue([
      { player: { username: "Artorias" } },
      { player: { username: "Guts" } },
      { player: { username: "Lady Maria" } },
    ]);

    const response = await matchService.getPlayers(10);

    expect(game.findByPk).toHaveBeenCalledWith(10);
    expect(match.findAll).toHaveBeenCalledWith({
      where: { id_game: 10 },
      include: {
        model: player,
        attributes: ["username"],
      },
    });
    expect(response).toEqual({
      game_id: 10,
      players: ["Artorias", "Guts", "Lady Maria"],
    });
  });

  test("returns message if game not found", async () => {
    game.findByPk.mockResolvedValue(null);

    const response = await matchService.getPlayers(999);

    expect(response).toEqual({ message: "Game not found" });
  });

  test("handles errors gracefully", async () => {
    game.findByPk.mockRejectedValue(new Error("DB error"));

    const response = await matchService.getPlayers(1);

    expect(response.message).toBe("An error occurred while retrieving players");
    expect(response.error).toBe("DB error");
  });
});