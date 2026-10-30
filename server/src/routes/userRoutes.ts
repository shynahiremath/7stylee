import { Router } from "express";
import { getAllUsers, updateUserRole, updateUserStatus } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";

const router = Router();

router.get("/", protect, adminOnly, getAllUsers);
router.patch("/:id/role", protect, adminOnly, updateUserRole);
router.patch("/:id/status", protect, adminOnly, updateUserStatus);

export default router;