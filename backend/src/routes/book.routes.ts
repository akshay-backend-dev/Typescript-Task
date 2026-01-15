import { Router } from "express";
import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  deleteAllBooks
} from "../controllers/book.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// Route to create new book
router.post("/books", addBook);

// Route to get all available books
router.get("/books", getBooks);

// Route to get specific book by id
router.get("/books/:id", getBookById);

// Route to update an specific existing book by id
router.put("/books/:id", updateBook);

//  Route to delete all books
router.delete("/books/all", deleteAllBooks);

// Route to delete a book
router.delete("/books/:id", deleteBook);

export default router;