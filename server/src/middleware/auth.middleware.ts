import { type Request, type Response, type NextFunction } from "express";
import authRepository from "../repositories/auth.repository.ts";
import { verifyToken } from "../utils/jwt.ts";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

class AuthMiddleware {
  async authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
        return;
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
        return;
      }

      const payload = verifyToken(token);

      const user = await authRepository.findById(Number(payload.id));

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid token.",
        });
        return;
      }

      req.user = user;

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
  }

  authorize(...roles: string[]) {
    return (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction,
    ): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
        return;
      }

      const userRole = req.user?.role_name ?? req.user?.role;

      if (!roles.includes(userRole)) {
        res.status(403).json({
          success: false,
          message: "Forbidden.",
        });
        return;
      }

      next();
    };
  }
}

export default new AuthMiddleware();
