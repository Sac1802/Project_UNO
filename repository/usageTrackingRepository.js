import { IUsageTracking } from "../interfaces/IUsageTracking.js";
import db from "../models/index.js";
import Either from "../utils/Either.js";

export class UsageTrackingRepository extends IUsageTracking {
  get model() {
    return db.UsageTracking || db.usageTracking;
  }

  async createUsageTracking(usageTracking) {
    const newUsageTracking = await this.model.create(usageTracking);
    if (!newUsageTracking) {
      return Either.left({
        message: "Failed to create Usage Tracking",
        statusCode: 500,
      });
    }
    return Either.right(newUsageTracking);
  }

  async getAllUsages() {
    const usages = await this.model.findAll();
    if (usages.length === 0) {
      return Either.left({
        message: "No Usages Found",
        statusCode: 404,
      });
    }
    return Either.right(usages);
  }

  async getById(idUsages) {
    const usage = await this.model.findByPk(idUsages);
    if (!usage) {
      return Either.left({
        message: `The Usage with ${idUsages} not found`,
        statusCode: 404,
      });
    }
    return Either.right(usage);
  }

  async updateUsageTracking(usageTracking, method, request, idUser) {
    const updatedUsageTracking = await this.model.findOne({
      where: {
        userId: idUser,
        endpointAccess: request,
        requestMethod: method,
      },
    });
    if (!updatedUsageTracking) {
      return Either.left({
        message: `The Usage with ${idUser} not found`,
        statusCode: 404,
      });
    }
    Object.assign(updatedUsageTracking, usageTracking);

    await updatedUsageTracking.save();
    return Either.right(updatedUsageTracking);
  }

  async getByRequest(request, method, userId) {
    const usages = await this.model.findOne({
      where: {
        endpointAccess: request,
        requestMethod: method,
        userId: userId,
      },
    });
    if (!usages) {
      return Either.left({
        message: `The Usage with ${request} not found`,
        statusCode: 404,
      });
    }
    return Either.right(usages);
  }
}