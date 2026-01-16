import { Request, Response } from "express";
import mongoose from "mongoose";

// Import model files
import Book from "../models/Book";

// Import schema files
import { bookSchema, updateBookSchema } from "../schemas/book.schema";

// import logger files
import logger from "../logger/logger";
import { getUserLogger } from "../logger/userLogger";

// Import socket files
import { bookSocket } from "../sockets/server/book.socket";


// Add new book
export const addBook = async (req: Request, res: Response) => {

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

  bookSocket.bookAdded({
    bookId: book._id,
    title: book.title,
    author: book.author,
    publishedYear: book.publishedYear,
    addedBy: { userId, role },
    createdAt: book.createdAt,
  });

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

    if (books.length === 0) {
      return res.status(404).json({
        message: "No books found",
      });
    }

    res.json(books);
  } catch (err) {
    logger.error("Get books aggregation failed", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get a book by ID
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


// Update an existing book by ID
export const updateBook = async (req: Request, res: Response) => {
  const { userId, role } = req.user!;

  const parsed = updateBookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  if (Object.keys(parsed.data).length === 0) {
    return res.status(400).json({
      message: "At least one field is required to update",
    });
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


// Delete a book by ID (Admin only)
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


// Delete ALL books (Admin only)
export const deleteAllBooks = async (req: Request, res: Response) => {
  const { role } = req.user!;

  if (role !== "admin") {
    return res.status(403).json({
      message: "Only admin can delete all books",
    });
  }

  if (req.query.confirm !== "true") {
    return res.status(400).json({
      message: "Please confirm delete by passing ?confirm=true",
    });
  }

  const result = await Book.deleteMany({});

  res.json({
    message: "All books deleted successfully",
    deletedCount: result.deletedCount,
  });
};