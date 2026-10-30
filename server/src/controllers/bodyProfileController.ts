import { Response } from "express";
import { BodyProfile } from "../models/BodyProfile";
import { AuthRequest } from "../middleware/authMiddleware";

export const getBodyProfile = async (req: AuthRequest, res: Response) => {
  try {
    let profile = await BodyProfile.findOne({ user: req.userId });
    if (!profile) {
      profile = await BodyProfile.create({ user: req.userId });
    }
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching body profile" });
  }
};

export const updateBodyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { height, bust, waist, hip, shoulder, inseam, preferredFit, preferredSize, completed } = req.body;

    const profile = await BodyProfile.findOneAndUpdate(
      { user: req.userId },
      { height, bust, waist, hip, shoulder, inseam, preferredFit, preferredSize, completed },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Update body profile error:", error);
    res.status(500).json({ message: "Server error updating body profile" });
  }
};