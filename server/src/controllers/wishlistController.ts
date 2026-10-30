import { Response } from "express";
import { Wishlist } from "../models/Wishlist";
import { AuthRequest } from "../middleware/authMiddleware";

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.userId });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.userId, productIds: [] });
    res.status(200).json({ productIds: wishlist.productIds });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching wishlist" });
  }
};

export const updateWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ message: "productIds must be an array" });
    }
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.userId },
      { productIds },
      { new: true, upsert: true }
    );
    res.status(200).json({ productIds: wishlist.productIds });
  } catch (error) {
    res.status(500).json({ message: "Server error updating wishlist" });
  }
};