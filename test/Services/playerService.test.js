import { PlayerService } from "../../services/playerService.js";
import bcrypt from "../../utils/bcrypt.js";
import Either from "../../utils/Either.js";

describe("PlayerService", () => {
  let playerService;
  let mockPlayerRepository;

  beforeEach(() => {
    mockPlayerRepository = {
      savePlayer: jest.fn(),
      getPlayers: jest.fn(),
      getByIdPlayer: jest.fn(),
      updateFullPlayer: jest.fn(),
      deletePlayer: jest.fn(),
      patchPlayer: jest.fn(),
    };

    playerService = new PlayerService(mockPlayerRepository);
    jest.clearAllMocks();
  });

  test("should create a player successfully", async () => {
    const playerData = { username: "lobo", password: "1234" };
    const encryptedPassword = "encrypted1234";

    bcrypt.encryptPassword = jest.fn().mockResolvedValue(encryptedPassword);
    mockPlayerRepository.savePlayer.mockResolvedValue(Either.right({ id: 1, username: "lobo" }));

    const result = await playerService.savePlayer(playerData);

    expect(bcrypt.encryptPassword).toHaveBeenCalledWith("1234");
    expect(mockPlayerRepository.savePlayer).toHaveBeenCalledWith({
      username: "lobo",
      password: encryptedPassword,
    });
    expect(result.isRight()).toBe(true);
    expect(result.right).toEqual({ message: "User registered successfully" });
  });

  test("should return left if player already exists", async () => {
    const playerData = { username: "lobo", password: "1234" };
    bcrypt.encryptPassword = jest.fn().mockResolvedValue("encrypted1234");
    mockPlayerRepository.savePlayer.mockResolvedValue(Either.left(new Error("duplicate key")));

    const result = await playerService.savePlayer(playerData);

    expect(result.isLeft()).toBe(true);
    expect(result.getError()).toEqual({
      message: "User could not be created (maybe already exists)",
      statusCode: 400,
    });
  });

  test("should get player by ID successfully", async () => {
    const mockPlayer = { id: 1, username: "lobo" };
    mockPlayerRepository.getByIdPlayer.mockResolvedValue(Either.right(mockPlayer));

    const result = await playerService.getByIdPlayer(1);

    expect(result.isRight()).toBe(true);
    expect(result.right).toEqual(mockPlayer);
    expect(mockPlayerRepository.getByIdPlayer).toHaveBeenCalledWith(1);
  });

  test("should return left if player not found by ID", async () => {
    mockPlayerRepository.getByIdPlayer.mockResolvedValue(Either.left(new Error("Not found")));

    const result = await playerService.getByIdPlayer(999);

    expect(result.isLeft()).toBe(true);
    expect(result.getError()).toEqual({
      message: "The player with id 999 does not exist",
      statusCode: 404,
    });
  });

  test("should get all players successfully", async () => {
    const players = [
      { id: 1, username: "player1" },
      { id: 2, username: "player2" },
    ];
    mockPlayerRepository.getPlayers.mockResolvedValue(Either.right(players));

    const result = await playerService.getPlayers();

    expect(result.isRight()).toBe(true);
    expect(result.right).toEqual(players);
    expect(mockPlayerRepository.getPlayers).toHaveBeenCalled();
  });

  test("should update player successfully", async () => {
    const newData = { username: "loboUpdated" };
    mockPlayerRepository.getByIdPlayer.mockResolvedValue(Either.right({ id: 1 }));
    mockPlayerRepository.updateFullPlayer.mockResolvedValue(Either.right({ id: 1, username: "loboUpdated" }));

    const result = await playerService.updateFullPlayer(newData, 1);

    expect(result.isRight()).toBe(true);
    expect(result.right).toEqual({ id: 1, username: "loboUpdated" });
    expect(mockPlayerRepository.updateFullPlayer).toHaveBeenCalledWith(1, newData);
  });

  test("should delete player successfully", async () => {
    mockPlayerRepository.getByIdPlayer.mockResolvedValue(Either.right({ id: 1 }));
    mockPlayerRepository.deletePlayer.mockResolvedValue(Either.right({ message: "Player deleted successfully" }));

    const result = await playerService.deletePlayer(1);

    expect(result.isRight()).toBe(true);
    expect(result.right).toEqual({ message: "Player deleted successfully" });
    expect(mockPlayerRepository.deletePlayer).toHaveBeenCalledWith(1);
  });

  test("should patch player successfully", async () => {
    const newData = { username: "loboUpdated" };
    mockPlayerRepository.getByIdPlayer.mockResolvedValue(Either.right({ id: 1 }));
    mockPlayerRepository.patchPlayer.mockResolvedValue(Either.right({ id: 1, username: "loboUpdated" }));

    const result = await playerService.patchPlayer(newData, 1);

    expect(result.isRight()).toBe(true);
    expect(result.right.username).toBe("loboUpdated");
    expect(mockPlayerRepository.patchPlayer).toHaveBeenCalledWith(newData, 1);
  });

  test("getByIdByToken should return correct fields", async () => {
    const mockPlayer = { id: 1, username: "lobo", email: "lobo@test.com", age: 25 };
    mockPlayerRepository.getByIdPlayer.mockResolvedValue(Either.right(mockPlayer));

    const result = await playerService.getByIdByToken(1);

    expect(result.isRight()).toBe(true);
    expect(result.right).toEqual({
      id: 1,
      username: "lobo",
      email: "lobo@test.com",
      age: 25,
    });
  });
});
