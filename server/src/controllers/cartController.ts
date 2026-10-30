import { Response } from "express";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";

// Get the logged-in user's cart, with product details populated
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: req.userId, items: [] });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error fetching cart" });
  }
};

// Add an item (or increase quantity if it already exists)
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, sku, quantity } = req.body;

    if (!productId || !sku || !quantity) {
      return res.status(400).json({ message: "productId, sku, and quantity are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variant = product.variants.find((v) => v.sku === sku);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found for this product" });
    }
    if (variant.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = await Cart.create({ user: req.userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.sku === sku);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, sku, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");

    res.status(200).json({ cart: populatedCart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error adding to cart" });
  }
};

// Remove an item entirely by SKU
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { sku } = req.params;

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.sku !== sku);
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.status(200).json({ cart: populatedCart });
  } catch (error) {
    res.status(500).json({ message: "Server error removing item" });
  }
};