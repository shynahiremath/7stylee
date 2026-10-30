import { Response } from "express";
import mongoose from "mongoose";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { AuthRequest } from "../middleware/authMiddleware";

export const createOrder = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { shippingAddress } = req.body;
    if (!shippingAddress) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const cart = await Cart.findOne({ user: req.userId }).session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = [];
    let subtotal = 0;

    // Re-check EVERYTHING from the database, never trust the cart blindly
    for (const item of cart.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({ message: `Product not found for an item in your cart` });
      }

      const variant = product.variants.find((v) => v.sku === item.sku);
      if (!variant) {
        await session.abortTransaction();
        return res.status(404).json({ message: `Variant ${item.sku} no longer exists` });
      }

      if (variant.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Not enough stock for ${product.name} (${item.sku}). Only ${variant.stock} left.`,
        });
      }

      const unitPrice = product.basePrice + variant.priceModifier;

      orderItems.push({
        product: product._id,
        sku: item.sku,
        name: product.name,
        quantity: item.quantity,
        unitPrice,
      });

      subtotal += unitPrice * item.quantity;

      // Decrement stock right here, inside the transaction
      variant.stock -= item.quantity;
      await product.save({ session });
    }

    const shipping = subtotal > 2000 ? 0 : 99; // simple flat rule for now
    const total = subtotal + shipping;

    const order = await Order.create(
      [
        {
          user: req.userId,
          items: orderItems,
          subtotal,
          shipping,
          total,
          shippingAddress,
          paymentStatus: "PENDING",
          status: "PENDING",
        },
      ],
      { session }
    );

    // Clear the cart now that the order has captured everything
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();

    res.status(201).json({ order: order[0] });
  } catch (error) {
    await session.abortTransaction();
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error creating order" });
  } finally {
    session.endSession();
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ["PENDING", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error updating order" });
  }
};