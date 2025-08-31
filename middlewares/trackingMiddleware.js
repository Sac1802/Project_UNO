import { UsageTrackingService } from "../services/usagesTrackingService.js";
import { UsageTrackingRepository } from "../repository/usageTrackingRepository.js";
import jwt from "jsonwebtoken";

export class trackingMiddleware {
  usageTrackingService;

  constructor() {
    const usageTrackingRepository = new UsageTrackingRepository();
    this.usageTrackingService = new UsageTrackingService(
      usageTrackingRepository
    );
  }

  withTracking(controller) {
    return async (req, res, next) => {
      const startTime = Date.now();
      const skipRoutes = [{ path: "/api/players", method: "POST" }];

      const shouldSkip = skipRoutes.some(
        (r) => r.path === req.path && r.method === req.method
      );

      if (shouldSkip) {
        return controller(req, res, next);
      }

      let idUser = req.user?.playerId || null;

      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        res.locals.responseTime = responseTime;
        if (req.path === "/login" && body.right?.access_token) {
          const decoded = jwt.verify(
            body.right.access_token,
            process.env.JWT_SECRET
          );
          idUser = decoded.playerId;
        }
        if (idUser) {
          await this.usageTrackingService
            .trackUsage(req, res, idUser)
            .catch((err) => console.warn("Tracking falló:", err));
        }

        return originalJson(body);
      };

      return controller(req, res, next);
    };
  }
}

export default trackingMiddleware;
