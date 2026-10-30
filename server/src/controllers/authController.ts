import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import { AuthRequest } from "../middleware/authMiddleware";

const isProduction = process.env.NODE_ENV === "production";

const refreshCookie = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const publicUser = (user: {
  _id: unknown;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
}) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive ?? true,
});

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, refreshCookie);

    res.status(201).json({
      user: publicUser(user),
      accessToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been deactivated. Contact support." });
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, refreshCookie);

    res.status(200).json({
      user: publicUser(user),
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no refresh token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { userId: string };
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const accessToken = generateAccessToken(user._id.toString());
    res.status(200).json({
      user: publicUser(user),
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, refresh token invalid or expired" });
  }
};

export const logoutUser = async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
});
  res.status(200).json({ message: "Logged out" });
};