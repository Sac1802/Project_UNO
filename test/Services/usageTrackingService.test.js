import Either from "../../utils/Either.js";
import { UsageTrackingService } from "../../services/usagesTrackingService.js";

describe("UsageTrackingService", () => {
  let mockRepo;
  let service;
  let req;
  let res;

  beforeEach(() => {
    mockRepo = {
      getByRequest: jest.fn(),
      createUsageTracking: jest.fn(),
      updateUsageTracking: jest.fn(),
      getAllUsages: jest.fn(),
    };

    service = new UsageTrackingService(mockRepo);

    req = {
      originalUrl: "/test-endpoint",
      method: "GET",
    };

    res = {
      locals: { responseTime: 100 },
      statusCode: 200,
    };
  });

  describe("trackUsage", () => {
    test("should create usage if not exists", async () => {
      mockRepo.getByRequest.mockResolvedValue(Either.left({}));
      mockRepo.createUsageTracking.mockResolvedValue(Either.right({ id: 1 }));

      const result = await service.trackUsage(req, res, 1);

      expect(mockRepo.getByRequest).toHaveBeenCalledWith("/test-endpoint", "GET", 1);
      expect(mockRepo.createUsageTracking).toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
    });

    test("should update usage if exists", async () => {
      const existingUsage = {
        id: 1,
        requestCount: 1,
        responseTime: { min: 50, max: 150, avg: 100 },
        requestMethod: "GET",
        userId: 1,
      };
      mockRepo.getByRequest.mockResolvedValue(Either.right(existingUsage));
      mockRepo.updateUsageTracking.mockResolvedValue(
        Either.right({ ...existingUsage, requestCount: 2 })
      );

      const result = await service.trackUsage(req, res, 1);

      expect(mockRepo.updateUsageTracking).toHaveBeenCalled();
      expect(result.isRight()).toBe(true);
    });
  });

  describe("getAllUsages", () => {
    test("should return processed usages on success", async () => {
      const usages = [
        { endpointAccess: "/a", requestMethod: "GET", requestCount: 2 },
        { endpointAccess: "/a", requestMethod: "POST", requestCount: 3 },
      ];
      mockRepo.getAllUsages.mockResolvedValue(Either.right(usages));

      const result = await service.getAllUsages();

      expect(result.isRight()).toBe(true);
      expect(result.right.total_requests).toBe(5);
      expect(result.right.breakdown["/a"]["GET"]).toBe(2);
      expect(result.right.breakdown["/a"]["POST"]).toBe(3);
    });

    test("should return left if repo fails", async () => {
      mockRepo.getAllUsages.mockResolvedValue(Either.left({ message: "DB error" }));

      const result = await service.getAllUsages();

      expect(result.isLeft()).toBe(true);
      expect(result.left.message).toBe("DB error");
    });
  });

  describe("getResponseTimes", () => {
    test("should return formatted response times", async () => {
      const usages = [
        {
          endpointAccess: "/a",
          responseTime: JSON.stringify({ avg: 75, min: 50, max: 100 }),
        },
      ];
      mockRepo.getAllUsages.mockResolvedValue(Either.right(usages));

      const result = await service.getResponseTimes();

      expect(result.isRight()).toBe(true);
      expect(result.right["/a"].avg).toBe("75.000");
      expect(result.right["/a"].min).toBe("50.000");
      expect(result.right["/a"].max).toBe("100.000");
    });
  });

  describe("getStatusCodes", () => {
    test("should return aggregated status codes", async () => {
      const usages = [
        { statusCode: 200, requestCount: 5 },
        { statusCode: 404, requestCount: 1 },
      ];
      mockRepo.getAllUsages.mockResolvedValue(Either.right(usages));

      const result = await service.getStatusCodes();

      expect(result.isRight()).toBe(true);
      expect(result.right[200]).toBe(5);
      expect(result.right[404]).toBe(1);
    });
  });

  describe("getTopEndpoints", () => {
    test("should return endpoints sorted by request count", async () => {
      const usages = [
        { endpointAccess: "/a", requestCount: 3 },
        { endpointAccess: "/b", requestCount: 5 },
      ];
      mockRepo.getAllUsages.mockResolvedValue(Either.right(usages));

      const result = await service.getTopEndpoints();

      expect(result.isRight()).toBe(true);
      expect(result.right[0].endpoint).toBe("/b");
      expect(result.right[0].request_count).toBe(5);
    });
  });
});
