import { type Request, type Response } from "express";
import authRepository from "../repositories/auth.repository.ts";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, first_name, last_name } = req.body;

      if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({
          message: "All fields are required.",
        });
      }

      const existingUser = await authRepository.findByEmail(email);

      if (existingUser) {
        return res.status(409).json({
          message: "Email already exists.",
        });
      }

      const userId = await authRepository.register({
        email,
        password,
        first_name,
        last_name,
      });

      res.status(201).json({
        message: "Registration successful.",
        userId,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Internal server error.",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await authRepository.findByEmail(email);

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }

      if (user.password !== password) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }

      if (!user.is_approved) {
        return res.status(403).json({
          message: "Account is waiting for approval.",
        });
      }

      if (user.status !== "ACTIVE") {
        return res.status(403).json({
          message: "Account is inactive.",
        });
      }

      res.status(200).json({
        message: "Login successful.",
        user,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Internal server error.",
      });
    }
  }

  async me(req: Request & { user?: any }, res: Response) {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
}

export default new AuthController();
