import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  publishedYear: z
    .coerce
    .number()
    .int("Published year must be an integer")
    .min(1500, "Published year must be greater than or equal to 1500"),
});