import { Router } from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cartController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.delete("/:sku", protect, removeFromCart);

export default router;