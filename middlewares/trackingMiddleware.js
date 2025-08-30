import { UsageTrackingService } from "../services/usageTrackingServices.js";
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
      let idUser = null;
      const skipRoutes = [{ path: "/api/players", method: "POST" }];
      const shouldSkip = skipRoutes.some(
        (r) => r.path === req.originalUrl && r.method === req.method
      );

      if (
        !shouldSkip &&
        req.originalUrl === "/api/auth/login" &&
        req.method === "POST"
      ) {
        const originalJson = res.json.bind(res);

        res.json = async (body) => {
          if (body?.token) {
            const decoded = jwt.verify(body.token, process.env.JWT_SECRET_KEY);
            idUser = decoded.id || null;

            await this.usageTrackingService
              .trackUsage(req, res, idUser)
              .catch((err) => console.warn("Tracking falló:", err));
          }

          return originalJson(body);
        };
      } else if (!shouldSkip) {
        idUser = req.params?.id || null;
        await this.usageTrackingService
          .trackUsage(req, res, idUser)
          .catch((err) => console.warn("Tracking falló:", err));
      }

      return controller(req, res, next);
    };
  }
}

export default trackingMiddleware;
