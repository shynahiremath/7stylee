import { Response } from "express";
import { AddressBook } from "../models/AddressBook";
import { AuthRequest } from "../middleware/authMiddleware";

export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    let book = await AddressBook.findOne({ user: req.userId });
    if (!book) book = await AddressBook.create({ user: req.userId, addresses: [] });
    res.status(200).json({ addresses: book.addresses });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching addresses" });
  }
};

export const updateAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const { addresses } = req.body;
    if (!Array.isArray(addresses)) {
      return res.status(400).json({ message: "addresses must be an array" });
    }
    const book = await AddressBook.findOneAndUpdate(
      { user: req.userId },
      { addresses },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ addresses: book.addresses });
  } catch (error) {
    res.status(500).json({ message: "Server error updating addresses" });
  }
};