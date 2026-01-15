import { Request, Response } from "express";
import User from "../models/User";
import mongoose from "mongoose";
import { Types } from "mongoose";
import { updateUserSchema } from "../schemas/user.schema";


// Get admin (Admin only)
export const getMyProfile = async (req: Request, res: Response) => {
  const { userId } = req.user!;

  const user = await User.findById(userId)
    .select("-password -__v");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json(user);
};


// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  const { role } = req.user!;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Only admin can view all users",
    });
  }

  const users = await User.find({ role: "user" })
    .select("-password -__v")
    .sort({ createdAt: -1 });

  if (users.length === 0) {
    return res.status(404).json({
      message: "No users found",
    });
  }

  res.json({
    totalUsers: users.length,
    users,
  });
};


// Get specific user by ID (Admin only)
export const getUserById = async (req: Request, res: Response) => {
  const { role, userId: adminId } = req.user!;
  const { id } = req.params;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Only admin can view user details",
    });
  }

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  const query =
    id === adminId
      ? { _id: id }
      : { _id: id, role: "user" };

  const user = await User.findOne(query)
    .select("-password -__v");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json(user);
};


// Update user by ID (Admin only)
export const updateUserById = async (req: Request, res: Response) => {
  const { role, userId: adminId } = req.user!;
  const { id } = req.params;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Only admin can update users",
    });
  }

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  const targetUser = await User.findById(id);
  if (!targetUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  if (Object.keys(parsed.data).length === 0) {
    return res.status(400).json({
      message: "At least one field is required to update",
    });
  }

  if ("role" in parsed.data) {
    delete parsed.data.role;
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    parsed.data,
    { new: true }
  ).select("-password -__v");

  res.status(200).json({
    message:
      adminId === id
        ? "Admin profile updated successfully"
        : "User updated successfully",
    user: updatedUser,
  });
};


// Delete all users (Admin only)
export const deleteAllUsers = async (req: Request, res: Response) => {
  const { role, userId } = req.user!;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Only admin can delete all users",
    });
  }

  if (req.query.confirm !== "true") {
    return res.status(400).json({
      message: "Please confirm delete by passing ?confirm=true",
    });
  }

  const result = await User.deleteMany({
    _id: { $ne: userId },
  });

  res.json({
    message: "All users deleted successfully",
    deletedCount: result.deletedCount,
  });
};


// Delete specific user by id (Admin only)
export const deleteUserById = async (req: Request, res: Response) => {
  const { role, userId: adminId } = req.user!;
  const { id } = req.params;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Only admin can delete users",
    });
  }

  if (id === adminId) {
    return res.status(400).json({
      message: "Admin cannot delete himself",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    message: "User deleted successfully",
    deletedUserId: id,
  });
};