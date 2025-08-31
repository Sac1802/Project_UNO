import { request } from "express";
import Either from "../utils/Either.js";

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
      return await this.updateUsageTracking(req, res, validate.right);
    }
  }

  async createUsageTracking(req, res, idUser, request) {
    const currentTime = res.locals.responseTime || 0;

    const usageTracking = {
      userId: idUser,
      requestCount: 1,
      responseTime: {
        min: currentTime,
        max: currentTime,
        avg: currentTime,
      },
      endpointAccess: request,
      requestMethod: req.method,
      statusCode: res.statusCode,
    };

    return await this.usageTrackingRepo.createUsageTracking(usageTracking);
  }

  async updateUsageTracking(req, res, validate) {
    const currentTime = res.locals.responseTime || 0;
    validate.requestCount++;

    const oldAvg = validate.responseTime?.avg || 0;
    const oldMin = validate.responseTime?.min ?? currentTime;
    const oldMax = validate.responseTime?.max ?? currentTime;

    validate.responseTime = {
      min: Math.min(oldMin, currentTime),
      max: Math.max(oldMax, currentTime),
      avg:
        (oldAvg * (validate.requestCount - 1) + currentTime) /
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

    const totalRequests = findUsages.right.reduce(
      (acc, usage) => acc + usage.requestCount,
      0
    );
    const breakdown = {};
    findUsages.right.forEach((usage) => {
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

    const times = findUsages.right.map((usage) => {
      const rt = JSON.parse(usage.responseTime);
      return [
        usage.endpointAccess,
        {
          avg: rt.avg !== null ? rt.avg.toFixed(3) : null,
          min: rt.min !== null ? rt.min.toFixed(3) : null,
          max: rt.max !== null ? rt.max.toFixed(3) : null,
        },
      ];
    });

    return Either.right(Object.fromEntries(times));
  }

  async getStatusCodes() {
    const findUsages = await this.usageTrackingRepo.getAllUsages();
    if (findUsages.isLeft()) return findUsages;

    const statusCodes = {};
    findUsages.right.forEach((usage) => {
      if (!statusCodes[usage.statusCode]) statusCodes[usage.statusCode] = 0;
      statusCodes[usage.statusCode] += usage.requestCount;
    });

    return Either.right(statusCodes);
  }

  async getTopEndpoints() {
    const findUsages = await this.usageTrackingRepo.getAllUsages();
    if (findUsages.isLeft()) return findUsages;

    const topUsages = findUsages.right
      .sort((a, b) => b.requestCount - a.requestCount)
      .map((usage) => ({
        endpoint: usage.endpointAccess,
        request_count: usage.requestCount,
      }));

    return Either.right(topUsages);
  }
}
