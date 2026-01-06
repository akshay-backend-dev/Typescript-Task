import { Request, Response } from "express";
import { Book } from "../models/Book";
import { bookSchema } from "../schemas/book.schema";

import logger from "../utils/logger";


// Add new book
export const addBook = async (req: Request, res: Response) => {
  logger.debug("Add book request received");
  logger.debug(`Book payload: ${JSON.stringify(req.body)}`);

  const parsed = bookSchema.safeParse(req.body);

  if (!parsed.success) {
    logger.warn("Add book validation failed");
    return res.status(400).json(parsed.error.flatten());
  }

  logger.debug(`Creating book for userId: ${(req as any).userId}`);

  const book = await Book.create({
    ...parsed.data,
    user: (req as any).userId,
  });

  logger.info(`Book created successfully | bookId: ${book._id}`);

  res.status(201).json(book);
};


// Get all books
export const getBooks = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const books = await Book.find({ user: userId });
  res.json(books);
};


// Get specific book by ID
export const getBookById = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const book = await Book.findOne({ _id: req.params.id, user: userId });
  if (!book) {
    logger.error("Book not found");
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
};


// Update an existing specific book by ID
export const updateBook = async (req: Request, res: Response) => {
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const userId = (req as any).userId;
  const book = await Book.findOneAndUpdate(
    { _id: req.params.id, user: userId },
    parsed.data,
    { new: true }
  );

  if (!book) {
    logger.error("Book not found");
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
};


// Delete specific book by ID
export const deleteBook = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const book = await Book.findOneAndDelete({ _id: req.params.id, user: userId });

  if (!book) {
    logger.error("Book not found");
    return res.status(404).json({ message: "Book not found" });
  }
  logger.info("Book deleted succesfully");
  res.json({ message: "Book deleted successfully" });
};