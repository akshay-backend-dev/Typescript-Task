import { Router } from "express";
import { getAllUsers, getUserById, updateUserById, deleteAllUsers, deleteUserById } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/users", getAllUsers);

router.get("/users/:id", getUserById);

router.put("/users/:id", updateUserById);

router.delete("/users/all", deleteAllUsers);

router.delete("/users/:id", deleteUserById);

export default router;
