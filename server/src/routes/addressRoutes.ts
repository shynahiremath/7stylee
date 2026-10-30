import { Router } from "express";
import { getAddresses, updateAddresses } from "../controllers/addressController";
import { protect } from "../middleware/authMiddleware";

const router = Router();
router.get("/", protect, getAddresses);
router.put("/", protect, updateAddresses);
export default router;