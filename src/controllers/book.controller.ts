import { Request, Response } from "express";
import Book from "../models/Book";
import { bookSchema } from "../schemas/book.schema";
import mongoose from "mongoose";

import logger from "../logger/logger";
import { getUserLogger } from "../logger/userLogger";

// Add new book
export const addBook = async (req: Request, res: Response) => {
  console.log("ADD BOOK CONTROLLER HIT");

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { userId, role } = req.user;
  const userLogger = getUserLogger(userId, role);

  userLogger.info("Add book request received");

  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) {
    userLogger.warn("Book validation failed");
    return res.status(400).json(parsed.error.flatten());
  }

  const book = await Book.create({
    ...parsed.data,
    user: userId,
  });

  userLogger.info(`Book added | bookId=${book._id}`);
  res.status(201).json(book);
};

// Get all books
export const getBooks = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.user!;

    const pipeline: any[] = [];

    if (role !== "admin") {
      pipeline.push({
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      });
    }

    pipeline.push(
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
      { $sort: { createdAt: -1 } }
    );

    const books = await Book.aggregate(pipeline);

    res.json(books);
  } catch (err) {
    logger.error("Get books aggregation failed", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get specific book by ID
export const getBookById = async (req: Request, res: Response) => {
  const { userId, role } = req.user!;

  const filter =
    role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, user: userId };

  const book = await Book.findOne(filter);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
};


// Update an existing specific book by ID
export const updateBook = async (req: Request, res: Response) => {
  const { userId, role } = req.user!;

  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const filter =
    role === "admin"
      ? { _id: req.params.id }          
      : { _id: req.params.id, user: userId };

  const book = await Book.findOneAndUpdate(
    filter,
    parsed.data,
    { new: true }
  );

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
};


// Delete specific book by ID
export const deleteBook = async (req: Request, res: Response) => {
  const { role } = req.user!;

  if (role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admin can delete books" });
  }

  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json({ message: "Book deleted successfully" });
};