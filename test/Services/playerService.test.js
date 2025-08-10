import * as playerService from "../../services/playerService.js";
import player from "../../models/player.js";

jest.mock("../../models/player.js");

describe("playerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a player", async () => {
    player.create.mockResolvedValue({ id: 1, username: "lobo" });

    const playerData = { username: "lobo", password: "1234" };
    const createdPlayer = await playerService.savePlayer(playerData);
    expect(player.create).toHaveBeenCalled();
    expect(createdPlayer).toHaveProperty(
      "message",
      "User registered successfully"
    );
  });

  test("should get a player by ID", async () => {
    player.findByPk.mockResolvedValue({ id: 1, username: "lobo" });

    const playerFound = await playerService.getByIdPlayer(1);
    expect(playerFound).toHaveProperty("id", 1);
  });

  test("should update a player", async () => {
    const userMock = {
      id: 1,
      username: "lobo",
      save: jest.fn().mockResolvedValue(true),
    };
    player.findByPk.mockResolvedValue(userMock);

    const playerData = { username: "loboUpdated", password: "1234" };
    const updatedPlayer = await playerService.updateFullPlayer(playerData, 1);
    expect(userMock.save).toHaveBeenCalled();
  });

  test("should delete a player", async () => {
    const userMock = { id: 1, destroy: jest.fn().mockResolvedValue() };
    player.findByPk.mockResolvedValue(userMock);

    await expect(playerService.deletePlayer(1)).resolves.toBeUndefined();
    expect(userMock.destroy).toHaveBeenCalled();
  });

  test("should not delete a player if not found", async () => {
    player.findByPk.mockResolvedValue(null);

    await expect(playerService.deletePlayer(999)).rejects.toThrow(
      "Error the player with 999 not exists"
    );
  });

  test("should patch a player", async () => {
    const updatedMock = { id: 1, username: "loboUpdated" };
    const userMock = {
      id: 1,
      update: jest.fn().mockResolvedValue(updatedMock),
    };
    player.findByPk.mockResolvedValue(userMock);

    const playerData = { username: "loboUpdated" };
    const patchedPlayer = await playerService.patchPlayer(playerData, 1);
    expect(userMock.update).toHaveBeenCalledWith(playerData);
    expect(patchedPlayer).toHaveProperty("id", 1);
    expect(patchedPlayer.username).toBe(playerData.username);
  });

  test("savePlayer should throw error if user already exists", async () => {
    player.create.mockRejectedValue(new Error("duplicate key"));

    const playerData = { username: "lobo", password: "1234" };

    await expect(playerService.savePlayer(playerData)).rejects.toThrow(
      "Error: User already exists"
    );
  });

  test("getByIdPlayer throws error if user not found", async () => {
    player.findByPk.mockResolvedValue(null);

    await expect(playerService.getByIdPlayer(999)).rejects.toThrow(
      "The player with 999 not exists"
    );
  });

  test("should throw error if user already exists", async () => {
    jest
      .spyOn(player, "create")
      .mockRejectedValue(new Error("Unique constraint error"));
    const playerData = { username: "lobo", password: "1234" };

    await expect(playerService.savePlayer(playerData)).rejects.toThrow(
      "Error: User already exists"
    );
  });

  test("getByIdPlayer throws error if player not found", async () => {
    jest.spyOn(player, "findByPk").mockResolvedValue(null);
    await expect(playerService.getByIdPlayer(999)).rejects.toThrow(
      "The player with 999 not exists"
    );
  });

  test("getByIdByToken throws error if player not found", async () => {
    jest.spyOn(player, "findByPk").mockResolvedValue(null);
    await expect(playerService.getByIdByToken(999)).rejects.toThrow(
      "The player with 999 not exists"
    );
  });

  test("updateFullPlayer throws error if player not found", async () => {
    jest.spyOn(player, "findByPk").mockResolvedValue(null);
    await expect(
      playerService.updateFullPlayer({ username: "x" }, 999)
    ).rejects.toThrow("Error the player with 999 not exists");
  });

  test("deletePlayer throws error if player not found", async () => {
    jest.spyOn(player, "findByPk").mockResolvedValue(null);
    await expect(playerService.deletePlayer(999)).rejects.toThrow(
      "Error the player with 999 not exists"
    );
  });

  test("patchPlayer throws error if player not found", async () => {
    jest.spyOn(player, "findByPk").mockResolvedValue(null);
    await expect(
      playerService.patchPlayer({ username: "x" }, 999)
    ).rejects.toThrow("Error the player with 999 not exists");
  });
});
