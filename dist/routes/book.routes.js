"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_controller_1 = require("../controllers/book.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Route to create new book
router.post("/books", book_controller_1.addBook);
// Route to get all available books
router.get("/books", book_controller_1.getBooks);
// Route to get specific book by id
router.get("/books/:id", book_controller_1.getBookById);
// Route to update an specific existing book by id
router.put("/books/:id", book_controller_1.updateBook);
// Route to delete a book
router.delete("/books/:id", book_controller_1.deleteBook);
exports.default = router;
