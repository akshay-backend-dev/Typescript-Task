import { Request, Response } from "express";
import { Book } from "../models/Book";
import logger from "../utils/logger";

export const getAllBooksWithUsers = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      logger.warn("Non-admin tried to access admin books");
      return res.status(403).json({ message: "Access denied" });
    }

    const books = await Book.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$user" },

      {
        $project: {
          title: 1,
          author: 1,
          publishedYear: 1,
          createdAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.role": 1,
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    res.json(books);
  } catch (err) {
    logger.error("Aggregation failed", err);
    res.status(500).json({ message: "Internal server error" });
  }
};