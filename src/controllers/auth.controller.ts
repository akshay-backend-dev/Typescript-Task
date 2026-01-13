import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { signupSchema, loginSchema } from "../schemas/auth.schema";

import logger from "../logger/logger";

export const signup = async (req: Request, res: Response) => {
  logger.debug("signup flow started");
  const parsed = signupSchema.safeParse(req.body);
  logger.debug(`Signup payload: ${JSON.stringify(req.body)}`);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }
  logger.debug("Signup payload validated successfully");

  const { name, email, role, password } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.error("Email already exists");
    return res.status(409).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    role,
    password: hashedPassword,
  });

  logger.info("User registered succesfully");
  res.status(201).json({ message: "User registered successfully", userId: user._id });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) {
    logger.error("Invalid credentials: Email");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.error("Invalid credentials: Password");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );
  res.status(200).json({
    success: true,
    token,
  });
  // res.json({ token }); OK status
};