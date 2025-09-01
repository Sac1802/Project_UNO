import { OrderGameRepository } from "../../repository/OrderGameRepoository.js";
import { OrderGame } from "../../models/orderGame.js";
import Either from "../../utils/Either.js";

// Mock de Sequelize
jest.mock("../../models/orderGame.js", () => ({
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
      const mockResult = { id_game: 1, order: "clockwise" };
      OrderGame.create.mockResolvedValue(mockResult);

      const result = await repo.saveOrderGame(1, "clockwise");

      expect(OrderGame.create).toHaveBeenCalledWith({ id_game: 1, order: "clockwise" });
      expect(result).toEqual(mockResult);
    });
  });

  describe("getOrdersByGame", () => {
    it("should return orders when found", async () => {
      const mockOrders = [{ id_game: 1, order: "clockwise" }];
      OrderGame.find.mockResolvedValue(mockOrders);

      const result = await repo.getOrdersByGame(1);

      expect(OrderGame.find).toHaveBeenCalledWith({ where: { id_game: 1 } });
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockOrders);
    });

    it("should return left when no orders found", async () => {
      OrderGame.find.mockResolvedValue(null);

      const result = await repo.getOrdersByGame(2);

      expect(OrderGame.find).toHaveBeenCalledWith({ where: { id_game: 2 } });
      expect(result.isLeft()).toBe(true);
      expect(result.left).toBe("Not match orde of game");
    });
  });

  describe("updateOrderGame", () => {
    it("should update the order game successfully", async () => {
      const mockUpdate = [1]; // Sequelize returns [affectedRows]
      OrderGame.update.mockResolvedValue(mockUpdate);

      const result = await repo.updateOrderGame(1, "counterclockwise");

      expect(OrderGame.update).toHaveBeenCalledWith(
        { order: "counterclockwise" },
        { where: { id_game: 1 } }
      );
      expect(result.isRight()).toBe(true);
      expect(result.right).toEqual(mockUpdate);
    });

    it("should return left on error", async () => {
      OrderGame.update.mockRejectedValue(new Error("DB error"));

      const result = await repo.updateOrderGame(1, "counterclockwise");

      expect(OrderGame.update).toHaveBeenCalled();
      expect(result.isLeft()).toBe(true);
      expect(result.left).toBe("DB error");
    });
  });
});
