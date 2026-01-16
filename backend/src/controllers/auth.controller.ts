import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Import model files
import User from "../models/User";

// Import schema files
import { signupSchema, loginSchema } from "../schemas/auth.schema";

// Import logger files
import logger from "../logger/logger";

//  import socket files
import { adminSocket } from "../sockets/server/admin.socket";
import { userSocket } from "../sockets/server/user.socket";


// Register a new user
export const signup = async (req: Request, res: Response) => {
  logger.debug("signup flow started");

  const parsed = signupSchema.safeParse(req.body);
  logger.debug(`Signup payload: ${JSON.stringify(req.body)}`);

  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

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

  logger.info("User registered successfully");

  adminSocket.userSignedUp({
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });

  logger.info(`Admins notified for new signup: ${email}`);

  return res.status(201).json({
    message: "User registered successfully",
    userId: user._id,
  });
};


// Login existing user
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
    { expiresIn: "7d" }
  );

  userSocket.userLoggedIn({
    userId: user._id,
    email: user.email,
    role: user.role,
    time: new Date().toISOString(),
  });

  logger.info(`Real-time login event emitted for ${email}`);

  return res.status(200).json({
    success: true,
    token,
  });
  // res.json({ token }); Default OK status
};