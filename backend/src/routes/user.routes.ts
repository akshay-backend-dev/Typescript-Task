import { Router } from "express";

// Import controller files
import { getMyProfile, getAllUsers, getUserById, updateUserById, deleteAllUsers, deleteUserById } from "../controllers/user.controller";

// Import middleware files
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware);

// Route to get admin id
router.get("/users/mine", getMyProfile);

// Route to get all users
router.get("/users", getAllUsers);

// Route to get user by id 
router.get("/users/:id", getUserById);

// Route to update existing user by id
router.put("/users/:id", updateUserById);

// Route to delete all users
router.delete("/users/all", deleteAllUsers);

// Route to delete user by id
router.delete("/users/:id", deleteUserById);

export default router;