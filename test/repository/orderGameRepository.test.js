import { OrderGameRepository } from "../../repository/OrderGameRepoository.js";
import db from "../../models/index.js";
import Either from "../../utils/Either.js";

jest.mock("../../models/index.js", () => ({
  OrderGame: {
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  },
}));

describe("OrderGameRepository", () => {
  let repo;

  beforeEach(() => {
    repo = new OrderGameRepository();
    jest.clearAllMocks();
  });

  describe("saveOrderGame", () => {
    it("should save an order game successfully", async () => {
      const mockResult = { id_game: 1, order_game: "clockwise" };
      db.OrderGame.create.mockResolvedValue(mockResult);

      const result = await repo.saveOrderGame(1, "clockwise");

      expect(db.OrderGame.create).toHaveBeenCalledWith({ id_game: 1, order_game: "clockwise" });
      expect(result).toEqual(Either.right(mockResult));
    });
  });

  describe("getOrdersByGame", () => {
    it("should return orders when found", async () => {
      const mockOrders = [{ id_game: 1, order_game: "clockwise" }];
      db.OrderGame.find.mockResolvedValue(mockOrders);

      const result = await repo.getOrdersByGame(1);

      expect(db.OrderGame.find).toHaveBeenCalledWith({ where: { id_game: 1 } });
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockOrders);
    });

    it("should return left when no orders found", async () => {
      db.OrderGame.find.mockResolvedValue(null);

      const result = await repo.getOrdersByGame(2);

      expect(db.OrderGame.find).toHaveBeenCalledWith({ where: { id_game: 2 } });
      expect(result.isLeft()).toBe(true);
      expect(result.left).toEqual({ message: "Not match order of game", statusCode: 404 });
    });
  });

  describe("updateOrderGame", () => {
    it("should update the order game successfully", async () => {
      const mockUpdate = [1];
      db.OrderGame.update.mockResolvedValue(mockUpdate);

      const result = await repo.updateOrderGame(1, "counterclockwise");

      expect(db.OrderGame.update).toHaveBeenCalledWith(
        { order_game: "counterclockwise" },
        { where: { id_game: 1 } }
      );
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockUpdate);
    });

    it("should return left on error", async () => {
      db.OrderGame.update.mockRejectedValue(new Error("DB error"));

      const result = await repo.updateOrderGame(1, "counterclockwise");

      expect(db.OrderGame.update).toHaveBeenCalled();
      expect(result.isLeft()).toBe(true);
      expect(result.left).toEqual({ message: "DB error", statusCode: 500 });
    });
  });
});