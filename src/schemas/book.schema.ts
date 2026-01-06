import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  publishedYear: z.number().int(),
});