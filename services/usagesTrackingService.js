import { request } from "express";
import Either from "../utils/Either";

export class UsageTrackingService {
  constructor(usageTrackingRepo) {
    this.usageTrackingRepo = usageTrackingRepo;
  }

  async trackUsage(req, res, idUser) {
    const request = req.originalUrl;
    const validate = await this.usageTrackingRepo.getByRequest(
      request,
      req.method,
      idUser
    );
    if (validate.isLeft()) {
      return await this.createUsageTracking(req, res, idUser, request);
    } else {
      return await this.updateUsageTracking(req, res, validate.value);
    }
  }

  async createUsageTracking(req, res, idUser, request) {
    const currentTime = parseFloat(res.get("X-Response-Time"));
    let usageTracking = new UsageTracking();
    usageTracking.userId = idUser;
    usageTracking.requestCount = 1;
    usageTracking.responseTime = {
      min: currentTime,
      max: currentTime,
      avg: currentTime,
    };
    usageTracking.endpointAccess = request;
    usageTracking.requestMethod = req.method;
    usageTracking.statusCode = res.statusCode;

    return await this.usageTrackingRepo.createUsageTracking(usageTracking);
  }

  async updateUsageTracking(req, res, validate) {
    const currentTime = parseFloat(res.get("X-Response-Time"));
    validate.requestCount++;
    validate.responseTime = {
      min: Math.min(validate.responseTime.min, currentTime),
      max: Math.max(validate.responseTime.max, currentTime),
      avg:
        (validate.responseTime.avg * (validate.requestCount - 1) +
          currentTime) /
        validate.requestCount,
    };

    return await this.usageTrackingRepo.updateUsageTracking(
      validate,
      validate.requestMethod,
      req.originalUrl,
      validate.userId
    );
  }

  async getAllUsages() {
    const findUsages = await this.usageTrackingRepo.getAllUsages();
    if (findUsages.isLeft()) return findUsages;

    const totalRequests = findUsages.value.reduce(
      (acc, usage) => acc + usage.requestCount,
      0
    );

    const breakdown = {};
    findUsages.value.forEach((usage) => {
      if (!breakdown[usage.endpointAccess]) {
        breakdown[usage.endpointAccess] = {};
      }
      if (!breakdown[usage.endpointAccess][usage.requestMethod]) {
        breakdown[usage.endpointAccess][usage.requestMethod] = 0;
      }
      breakdown[usage.endpointAccess][usage.requestMethod] +=
        usage.requestCount;
    });

    const result = {
      total_requests: totalRequests,
      breakdown,
    };

    return Either.right(result);
  }

  async getResponseTimes() {
    const findUsages = await this.usageTrackingRepo.getAllUsages();
    if (findUsages.isLeft()) return findUsages;

    const times = findUsages.value.map((usage) => [
      usage.endpointAccess,
      {
        avg: usage.responseTime.avg.toFixed(2),
        min: usage.responseTime.min.toFixed(2),
        max: usage.responseTime.max.toFixed(2),
      },
    ]);

    return Either.right(Object.fromEntries(times));
  }

  async getStatusCodes() {
    const findUsages = await this.usageTrackingRepo.getAllUsages();
    if (findUsages.isLeft()) return findUsages;

    const statusCodes = {};
    findUsages.value.forEach((usage) => {
      if (!statusCodes[usage.statusCode]) statusCodes[usage.statusCode] = 0;
      statusCodes[usage.statusCode] += usage.requestCount;
    });

    return Either.right(statusCodes);
  }

  async getTopEndpoints() {
    const findUsages = await this.usageTrackingRepo.getAllUsages();
    if (findUsages.isLeft()) return findUsages;

    const topUsages = findUsages.value
      .sort((a, b) => b.requestCount - a.requestCount)
      .map((usage) => ({
        endpoint: usage.endpointAccess,
        request_count: usage.requestCount,
      }));

    return Either.right(topUsages);
  }
}
