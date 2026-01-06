import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";

const router = Router();

// Route for signup
router.post("/signup", signup);

//Route for login
router.post("/login", login);

export default router;