import { Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const mapped = users.map((u) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
    }));
    res.status(200).json({ users: mapped });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching users" });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!["CUSTOMER", "ADMIN"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (req.params.id === req.userId && role !== "ADMIN") {
      return res.status(400).json({ message: "You cannot remove your own admin access" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role, isActive: user.isActive },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error updating role" });
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be true or false" });
    }

    if (req.params.id === req.userId && isActive === false) {
      return res.status(400).json({ message: "You cannot deactivate your own account" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role, isActive: user.isActive },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error updating status" });
  }
};