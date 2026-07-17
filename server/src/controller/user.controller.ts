import { type Request, type Response } from "express";
import userRepository from "../repositories/user.repository.ts";

class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await userRepository.fetchUsers();

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch users.",
      });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const user = await userRepository.fetchUser(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch user.",
      });
    }
  }

  async approveUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await userRepository.approve(id);

      res.status(200).json({
        success: true,
        message: "User approved successfully.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to approve user.",
      });
    }
  }

  async deactivateUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await userRepository.deactivate(id);

      res.status(200).json({
        success: true,
        message: "User deactivated successfully.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: "Failed to deactivate user.",
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updates = req.body;

      await userRepository.updateUser(id, updates);

      res
        .status(200)
        .json({ success: true, message: "User updated successfully." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update user." });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await userRepository.deleteUser(id);

      res
        .status(200)
        .json({ success: true, message: "User deleted successfully." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete user." });
    }
  }
}

export default new UserController();
