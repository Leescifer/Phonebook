import { type Request, type Response } from "express";
import authRepository from "../repositories/auth.repository.ts";
import { comparePassword, hashPassword } from "../utils/bcrypt.ts";
import { generateToken } from "../utils/jwt.ts";
import { isEmailValid, isPasswordValid } from "../utils/custom.validator.ts";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, first_name, last_name } = req.body;

      if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      if (!isEmailValid(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email format." });
      }

      if (!isPasswordValid(password)) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be exactly 8 characters and contain at least one number and one special character.",
        });
      }

      const existingUser = await authRepository.findByEmail(email);

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists.",
        });
      }

      const hashedPassword = await hashPassword(password);
      const userId = await authRepository.register({
        email,
        password: hashedPassword,
        first_name,
        last_name,
      });

      res.status(201).json({
        success: true,
        message: "Registration successful.",
        userId,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
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
          success: false,
          message: "Invalid email.",
        });
      }

      const passwordMatch = await comparePassword(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password.",
        });
      }

      if (!user.is_approved) {
        return res.status(403).json({
          success: false,
          message: "Account is waiting for approval.",
        });
      }

      if (user.status !== "ACTIVE") {
        return res.status(403).json({
          success: false,
          message: "Account is inactive.",
        });
      }

      const token = generateToken({
        id: String(user.id),
        jti: String(user.id),
        email: user.email,
        role: user.role_name ?? "USER",
      });

      res.status(200).json({
        success: true,
        message: "Login successful.",
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role_name ?? "USER",
          status: user.status,
          is_approved: user.is_approved,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  async me(req: Request & { user?: any }, res: Response) {
    try {
      res.status(200).json({ success: true, data: req.user });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email, newPassword } = req.body;

      if (!email || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Email and new password are required.",
        });
      }

      const user = await authRepository.findByEmail(email);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      const hashedPassword = await hashPassword(newPassword);
      await authRepository.updatePassword(user.id, hashedPassword);

      res
        .status(200)
        .json({ success: true, message: "Password updated successfully." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
}

export default new AuthController();
