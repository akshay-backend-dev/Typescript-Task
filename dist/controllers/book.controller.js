"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getBooks = exports.addBook = void 0;
const Book_1 = __importDefault(require("../models/Book"));
const book_schema_1 = require("../schemas/book.schema");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../logger/logger"));
const userLogger_1 = require("../logger/userLogger");
// Add new book
const addBook = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { userId, role } = req.user;
    const userLogger = (0, userLogger_1.getUserLogger)(userId, role);
    userLogger.info("Add book request received");
    const parsed = book_schema_1.bookSchema.safeParse(req.body);
    if (!parsed.success) {
        userLogger.warn("Book validation failed");
        return res.status(400).json(parsed.error.flatten());
    }
    const book = await Book_1.default.create({
        ...parsed.data,
        user: userId,
    });
    userLogger.info(`Book added | bookId=${book._id}`);
    res.status(201).json(book);
};
exports.addBook = addBook;
// Get all books
const getBooks = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const pipeline = [];
        if (role !== "admin") {
            pipeline.push({
                $match: {
                    user: new mongoose_1.default.Types.ObjectId(userId),
                },
            });
        }
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        }, { $unwind: "$user" }, {
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
        }, { $sort: { createdAt: -1 } });
        const books = await Book_1.default.aggregate(pipeline);
        res.json(books);
    }
    catch (err) {
        logger_1.default.error("Get books aggregation failed", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getBooks = getBooks;
// Get specific book by ID
// export const getBookById = async (req: Request, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const filter =
//     req.user.role === "admin"
//       ? { _id: req.params.id }
//       : { _id: req.params.id, user: req.user.userId };
//   const book = await Book.findOne(filter);
//   if (!book) {
//     return res.status(404).json({ message: "Book not found" });
//   }
//   res.json(book);
// };
const getBookById = async (req, res) => {
    const { userId, role } = req.user;
    const filter = role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, user: userId };
    const book = await Book_1.default.findOne(filter);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
};
exports.getBookById = getBookById;
// Update an existing specific book by ID
// export const updateBook = async (req: Request, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const { userId, role } = req.user;
//   const userLogger = getUserLogger(userId, role);
//   const parsed = bookSchema.safeParse(req.body);
//   if (!parsed.success) {
//     userLogger.warn("Update validation failed");
//     return res.status(400).json(parsed.error.flatten());
//   }
//   const filter =
//     role === "admin"
//       ? { _id: req.params.id }
//       : { _id: req.params.id, user: userId };
//   const book = await Book.findOneAndUpdate(
//     filter,
//     parsed.data,
//     { new: true }
//   );
//   if (!book) {
//     userLogger.warn("Update failed: Book not found or access denied");
//     return res.status(404).json({ message: "Book not found" });
//   }
//   userLogger.info(`Book updated | bookId=${book._id}`);
//   res.json(book);
// };
const updateBook = async (req, res) => {
    const { userId, role } = req.user;
    const parsed = book_schema_1.bookSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
    }
    const filter = role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, user: userId };
    const book = await Book_1.default.findOneAndUpdate(filter, parsed.data, { new: true });
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
};
exports.updateBook = updateBook;
// Delete specific book by ID
// export const deleteBook = async (req: Request, res: Response) => {
//    if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const { userId, role } = req.user!;
//   const userLogger = getUserLogger(userId, role);
//   if (role !== "admin") {
//     userLogger.warn("Unauthorized delete attempt");
//     return res.status(403).json({ message: "Only admin can delete books" });
//   }
//   const filter =
//     role === "admin"
//       ? { _id: req.params.id }
//       : { _id: req.params.id, user: userId };
//   const book = await Book.findByIdAndDelete(req.params.id);
//   if (!book) {
//     userLogger.warn("Delete failed: Book not found");
//     return res.status(404).json({ message: "Book not found" });
//   }
//   userLogger.info(`Book deleted | bookId=${book._id}`);
//   res.json({ message: "Book deleted successfully" });
// };
const deleteBook = async (req, res) => {
    const { role } = req.user;
    if (role !== "admin") {
        return res
            .status(403)
            .json({ message: "Only admin can delete books" });
    }
    const book = await Book_1.default.findByIdAndDelete(req.params.id);
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
};
exports.deleteBook = deleteBook;
