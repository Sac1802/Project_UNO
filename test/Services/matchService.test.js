import { MatchService } from "../../services/matchService.js";
import { MatchRepository } from "../../repository/matchRepository.js";
import { GameRepository } from "../../repository/gameRepository.js";

jest.mock("../../repository/matchRepository.js");
jest.mock("../../repository/gameRepository.js");

describe("MatchService", () => {
  let matchService;
  let mockMatchRepository;
  let mockGameRepository;

  beforeEach(() => {
    mockMatchRepository = {
      count: jest.fn(),
      findOne: jest.fn(),
      saveUserMatch: jest.fn(),
      changeStatus: jest.fn(),
      getPlayers: jest.fn(),
      changeStatusAllPlayers: jest.fn(),
      listUser: jest.fn(),
    };

    mockGameRepository = {
      getById: jest.fn(),
    };

    MatchRepository.mockImplementation(() => mockMatchRepository);
    GameRepository.mockImplementation(() => mockGameRepository);
    matchService = new MatchService(mockMatchRepository, mockGameRepository);
    jest.clearAllMocks();
  });

  describe("saveUserMatch", () => {
    test("should return message if game does not exist", async () => {
      mockGameRepository.getById.mockResolvedValue(null);

      const response = await matchService.saveUserMatch(10, 5);

      expect(mockGameRepository.getById).toHaveBeenCalledWith(10);
      expect(response).toEqual({ message: "Game not found" });
    });

    test("should return message if game is full", async () => {
      mockGameRepository.getById.mockResolvedValue({ max_players: 2 });
      mockMatchRepository.count.mockResolvedValue(2);

      const response = await matchService.saveUserMatch(10, 5);

      expect(mockGameRepository.getById).toHaveBeenCalledWith(10);
      expect(mockMatchRepository.count).toHaveBeenCalledWith(10);
      expect(response).toEqual({ message: "Full game" });
    });

    test("should create a new match entry if user is not already registered", async () => {
      mockGameRepository.getById.mockResolvedValue({ max_players: 3 });
      mockMatchRepository.count.mockResolvedValue(1);
      mockMatchRepository.findOne.mockResolvedValue(null);
      mockMatchRepository.saveUserMatch.mockResolvedValue({
        id_game: 10,
        id_player: 5,
        status: "wait",
      });

      const response = await matchService.saveUserMatch(10, 5);

      expect(mockMatchRepository.findOne).toHaveBeenCalledWith(10, 5);
      expect(mockMatchRepository.saveUserMatch).toHaveBeenCalledWith({
        id_game: 10,
        id_player: 5,
        status: "wait",
      });
      expect(response).toEqual({
        message: "User joined the game successfully",
      });
    });

    test("should return message if user is already registered", async () => {
      mockGameRepository.getById.mockResolvedValue({ max_players: 3 });
      mockMatchRepository.count.mockResolvedValue(1);
      mockMatchRepository.findOne.mockResolvedValue({ id: 1 });

      const response = await matchService.saveUserMatch(10, 5);

      expect(response).toEqual({
        message: "The user is already registered for this game",
      });
    });
  });

  describe("changeStatus", () => {
    test("should return error if user not found", async () => {
      mockMatchRepository.findOne.mockResolvedValue(null);

      const response = await matchService.changeStatus(10, 5);

      expect(mockMatchRepository.findOne).toHaveBeenCalledWith(10, 5);
      expect(response.message).toBe(
        "An error occurred while changing the status of the user"
      );
      expect(response.error).toBe("The user or game id does not exist");
    });

    test("should update status to ready successfully", async () => {
      const mockUser = { status: "wait" };
      mockMatchRepository.findOne.mockResolvedValue(mockUser);
      mockMatchRepository.changeStatus.mockResolvedValue();

      const response = await matchService.changeStatus(10, 5);

      expect(mockUser.status).toBe("ready");
      expect(mockMatchRepository.changeStatus).toHaveBeenCalledWith(mockUser, 10, 5);
      expect(response.message).toBe(
        "User status changed to ready successfully"
      );
    });
  });

  describe("changeStatusInGame", () => {
    test("should only allow the game owner to start the game", async () => {
      mockGameRepository.getById.mockResolvedValue({ game_owner: 99 });

      const response = await matchService.changeStatusInGame(10, 5);

      expect(mockGameRepository.getById).toHaveBeenCalledWith(10);
      expect(response).toEqual({
        message: "Only the owner of the game can start the game",
      });
    });

    test("should update all users status to inGame", async () => {
      mockGameRepository.getById.mockResolvedValue({ game_owner: 5 });
      mockMatchRepository.getPlayers.mockResolvedValue([{}, {}]);
      mockMatchRepository.changeStatusAllPlayers.mockResolvedValue();

      const response = await matchService.changeStatusInGame(10, 5);

      expect(mockMatchRepository.changeStatusAllPlayers).toHaveBeenCalledWith(
        { status: "inGame" },
        10
      );
      expect(response.message).toBe("Game started successfully");
    });
  });

  describe("abandonmentGame", () => {
    test("should return message if the game does not exist", async () => {
      mockGameRepository.getById.mockResolvedValue(null);

      const response = await matchService.abandonmentGame(10, 5);

      expect(mockGameRepository.getById).toHaveBeenCalledWith(10);
      expect(response).toEqual({ message: "Game not found" });
    });

    test("should return message if game not started or user not in-game", async () => {
      mockGameRepository.getById.mockResolvedValue({ status: "waiting" });
      mockMatchRepository.findOne.mockResolvedValue({ status: "wait" });

      const response = await matchService.abandonmentGame(10, 5);

      expect(mockMatchRepository.findOne).toHaveBeenCalledWith(10, 5);
      expect(response).toEqual({
        message: "The game has not started or has alredy ended",
      });
    });

    test("should update status to abandonment successfully", async () => {
      mockGameRepository.getById.mockResolvedValue({ status: "in_progress" });
      mockMatchRepository.findOne.mockResolvedValue({ status: "inGame" });
      mockMatchRepository.changeStatus.mockResolvedValue([1]);

      const response = await matchService.abandonmentGame(10, 5);

      expect(mockMatchRepository.changeStatus).toHaveBeenCalledWith(
        { status: "abandonment" },
        10,
        5
      );
      expect(response).toEqual({ message: "User left the game successfully" });
    });
  });

  describe("endGame", () => {
    test("should only allow the game owner to end the game", async () => {
      mockGameRepository.getById.mockResolvedValue({ game_owner: 99 });

      const response = await matchService.endGame(10, 5);

      expect(mockGameRepository.getById).toHaveBeenCalledWith(10);
      expect(response).toEqual({
        message: "Only the owner of the game can start the game",
      });
    });
  });

  describe("getPlayers", () => {
    test("should return players list for valid game", async () => {
      mockGameRepository.getById.mockResolvedValue({ id: 10 });
      mockMatchRepository.getPlayers.mockResolvedValue([
        { player: { username: "Artorias" } },
        { player: { username: "Guts" } },
        { player: { username: "Lady Maria" } },
      ]);

      const response = await matchService.getPlayers(10);

      expect(mockGameRepository.getById).toHaveBeenCalledWith(10);
      expect(mockMatchRepository.getPlayers).toHaveBeenCalledWith(10);
      expect(response).toEqual({
        game_id: 10,
        players: ["Artorias", "Guts", "Lady Maria"],
      });
    });

    test("should return message if game not found", async () => {
      mockGameRepository.getById.mockResolvedValue(null);

      const response = await matchService.getPlayers(999);

      expect(response).toEqual({ message: "Game not found" });
    });
  });
});