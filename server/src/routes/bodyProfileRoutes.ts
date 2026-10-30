import { Router } from "express";
import { getBodyProfile, updateBodyProfile } from "../controllers/bodyProfileController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getBodyProfile);
router.put("/", protect, updateBodyProfile);

export default router;