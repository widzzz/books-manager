import { z } from "zod";

export const CategoryInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(64, "Name is too long"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().optional(),
  addBooks: z.array(z.string()).optional(),
});

export const BookInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.array(z.string().min(1)).min(
    1,
    "At least one author is required",
  ),
  publicationYear: z.number().int().min(1000).max(new Date().getFullYear(), "Publication year must not be in the future"),
  publisher: z.string().min(1, "Publisher is required"),
  pages: z.number().positive("Pages must be a positive number"),
  categories: z.array(z.string().min(1)),
  language: z.string().min(1, "Language is required"),
  image: z.string().url().startsWith("https://", {
    message: "Image URL must start with https://",
  }),
});

export const BooksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  search: z.string().trim().optional(),
  title: z.string().trim().optional(),
  author: z.string().trim().optional(),
  publisher: z.string().trim().optional(),
  category: z.union([
    z.string(),
    z.array(z.string()),
  ]).optional(),
  fromYear: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional(),
  toYear: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional(),
});

export const DeleteCategorySchema = z.object({
  slug: z.string(),
});

export const DeleteBooksSchema = z.object({
  id: z.string().min(24).max(24),
});
