import { Router } from "express";
import { contactUsController } from "../controllers/contact.controller";

const router = Router();

router.post("/contact-us", contactUsController);

export default router;