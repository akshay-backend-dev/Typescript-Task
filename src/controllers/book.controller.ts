import { Request, Response } from "express";
import { Book } from "../models/Book";
import { bookSchema } from "../schemas/book.schema";
import { requireUser } from "../utils/requireUser";

import logger from "../utils/logger";


// Add new book
export const addBook = async (req: Request, res: Response) => {
  const user = requireUser(req, res);
  if (!user) return;

  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const book = await Book.create({
    ...parsed.data,
    user: user.userId,
  });

  logger.info(`Book created | bookId=${book._id}`);
  res.status(201).json(book);
};

// Get all books
export const getBooks = async (req: Request, res: Response) => {
  const user = requireUser(req, res);
  if (!user) return;

  const books = await Book.find({ user: user.userId });
  res.json(books);
};

// Get specific book by ID
export const getBookById = async (req: Request, res: Response) => {
  const user = requireUser(req, res);
  if (!user) return;

  const book = await Book.findOne({
    _id: req.params.id,
    user: user.userId,
  });

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
};


// Update an existing specific book by ID
export const updateBook = async (req: Request, res: Response) => {
  const user = requireUser(req, res);
  if (!user) return;

  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const book = await Book.findOneAndUpdate(
    { _id: req.params.id, user: user.userId },
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
  if (!req.user) {
    logger.warn("Unauthorized delete attempt");
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    logger.warn(
      `Forbidden delete attempt by userId=${req.user.userId}, role=${req.user.role}`
    );
    return res.status(403).json({ message: "Only admin can delete books" });
  }

  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    logger.warn("Book not found");
    return res.status(404).json({ message: "Book not found" });
  }

  logger.info(`Book deleted by admin | bookId=${book._id}`);
  return res.json({ message: "Book deleted successfully" });
};