import { UsageTrackingRepository } from "../repository/usageTrackingRepository.js";
import { UsageTrackingService } from "../services/usagesTrackingService.js";
import Either from "../utils/Either.js";

function createService() {
  return new UsageTrackingService(new UsageTrackingRepository());
}

export async function getAllUsages(req, res, next) {
  const service = createService();
  const usages = await service.getAllUsages();
  if (usages.isRight()) {
    return res.status(201).json({ usages: usages.right });
  } else {
    const error = usages.getError();
    return res.status(error?.statusCode || 500).send({
      message: error?.message,
      errors: error?.errors,
    });
  }
}

export async function responseTimes(req, res, next) {
  const service = createService();
  const responseTime = await service.getResponseTimes();
  if (responseTime.isRight()) {
    return res.status(201).json({ responseTime: responseTime.right });
  } else {
    const error = responseTime.getError();
    return res.status(error?.statusCode || 500).send({
      message: error?.message,
      errors: error?.errors,
    });
  }
}

export async function statusCodes(req, res, next) {
  const service = createService();
  const statusCode = await service.getStatusCodes();
  if (statusCode.isRight()) {
    return res.status(201).json({ statusCode: statusCode.right });
  } else {
    const error = statusCode.getError();
    return res.status(error?.statusCode || 500).send({
      message: error?.message,
      errors: error?.errors,
    });
  }
}

export async function topEndpoints(req, res, next) {
  const service = createService();
  const topEndpoint = await service.getTopEndpoints();
  if (topEndpoint.isRight()) {
    return res.status(201).json({ topEndpoint: topEndpoint.right });
  } else {
    const error = topEndpoint.getError();
    return res.status(error?.statusCode || 500).send({
      message: error?.message,
      errors: error?.errors,
    });
  }
}