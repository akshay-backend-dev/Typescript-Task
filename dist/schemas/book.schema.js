"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookSchema = void 0;
const zod_1 = require("zod");
exports.bookSchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    author: zod_1.z.string().min(2),
    publishedYear: zod_1.z.number().int(),
});
