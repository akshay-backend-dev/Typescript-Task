import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getAllBooksWithUsers } from "../controllers/admin.controller";

const router = Router();

router.use(authMiddleware);

// Admin aggregation route
router.get("/admin/books", getAllBooksWithUsers);

export default router;