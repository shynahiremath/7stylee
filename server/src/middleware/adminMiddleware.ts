import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { User } from "../models/User";

export const adminOnly = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied: admin only" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error checking admin access" });
  }
};