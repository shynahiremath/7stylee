import { Router } from "express";
import { getWishlist, updateWishlist } from "../controllers/wishlistController";
import { protect } from "../middleware/authMiddleware";

const router = Router();
router.get("/", protect, getWishlist);
router.put("/", protect, updateWishlist);
export default router;