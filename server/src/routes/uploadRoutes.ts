import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController";
import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/", protect, adminOnly, upload.single("image"), uploadImage);

export default router;