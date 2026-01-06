import { Request, Response } from "express";
import { Book } from "../models/Book";
import { bookSchema } from "../schemas/book.schema";


// Add new book
export const addBook = async (req: Request, res: Response) => {
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const book = await Book.create({
    ...parsed.data,
    user: (req as any).userId,
  });

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
  if (!book) return res.status(404).json({ message: "Book not found" });
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

  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};


// Delete specific book by ID
export const deleteBook = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const book = await Book.findOneAndDelete({ _id: req.params.id, user: userId });

  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json({ message: "Book deleted successfully" });
};