import * as usageController from "../../controllers/usageTrackingController.js";
import { UsageTrackingService } from "../../services/usagesTrackingService.js";
import Either from "../../utils/Either.js";

jest.mock("../../services/usagesTrackingService.js", () => ({
  UsageTrackingService: jest.fn().mockImplementation(() => ({
    getAllUsages: jest.fn(),
    getResponseTimes: jest.fn(),
    getStatusCodes: jest.fn(),
    getTopEndpoints: jest.fn(),
  })),
}));

describe("UsageController", () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let mockServiceInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockNext = jest.fn();

    mockServiceInstance = {
      getAllUsages: jest.fn(),
      getResponseTimes: jest.fn(),
      getStatusCodes: jest.fn(),
      getTopEndpoints: jest.fn(),
    };
    const mockedClass = jest.mocked(UsageTrackingService);
    mockedClass.mockImplementation(() => mockServiceInstance);
  });

  describe("getAllUsages", () => {
    it("should return usages on success", async () => {
      mockServiceInstance.getAllUsages.mockResolvedValue(Either.right([{ id: 1 }]));

      await usageController.getAllUsages(mockReq, mockRes, mockNext);

      expect(mockServiceInstance.getAllUsages).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ usages: [{ id: 1 }] });
    });

    it("should handle error properly", async () => {
      const error = { message: "DB error", statusCode: 500 };
      mockServiceInstance.getAllUsages.mockResolvedValue(Either.left(error));

      await usageController.getAllUsages(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "DB error",
        errors: undefined,
      });
    });
  });

  describe("responseTimes", () => {
    it("should return response times on success", async () => {
      mockServiceInstance.getResponseTimes.mockResolvedValue(Either.right([100, 200]));

      await usageController.responseTimes(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ responseTime: [100, 200] });
    });

    it("should handle error properly", async () => {
      const error = { message: "Error fetching times" };
      mockServiceInstance.getResponseTimes.mockResolvedValue(Either.left(error));

      await usageController.responseTimes(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({ message: "Error fetching times", errors: undefined });
    });
  });

  describe("statusCodes", () => {
    it("should return status codes on success", async () => {
      mockServiceInstance.getStatusCodes.mockResolvedValue(Either.right([200, 404]));

      await usageController.statusCodes(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ statusCode: [200, 404] });
    });

    it("should handle error properly", async () => {
      const error = { message: "Error fetching status codes" };
      mockServiceInstance.getStatusCodes.mockResolvedValue(Either.left(error));

      await usageController.statusCodes(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({ message: "Error fetching status codes", errors: undefined });
    });
  });

  describe("topEndpoints", () => {
    it("should return top endpoints on success", async () => {
      mockServiceInstance.getTopEndpoints.mockResolvedValue(Either.right(["/api/users"]));

      await usageController.topEndpoints(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ topEndpoint: ["/api/users"] });
    });

    it("should handle error properly", async () => {
      const error = { message: "Error fetching top endpoints" };
      mockServiceInstance.getTopEndpoints.mockResolvedValue(Either.left(error));

      await usageController.topEndpoints(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({ message: "Error fetching top endpoints", errors: undefined });
    });
  });
});