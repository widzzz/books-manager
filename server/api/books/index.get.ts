import { client } from "@/server/db";
import { BooksQuerySchema } from "~/server/schema";

export default defineEventHandler(async (event) => {
  const rawQuery = getQuery(event);
  const result = BooksQuerySchema.safeParse(rawQuery);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid query parameters",
    });
  }

  const { page, search, title, author, publisher, category, fromYear, toYear } =
    result.data;
  const limit = 6;

  const filter: any = {};

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [
      { title: { $regex: regex } },
      { author: { $regex: regex } },
      { publisher: { $regex: regex } },
    ];
  }

  if (title) filter.title = { $regex: new RegExp(title, "i") };
  if (author) filter.author = { $regex: new RegExp(author, "i") };
  if (publisher) filter.publisher = { $regex: new RegExp(publisher, "i") };

  if (category) {
    filter.categories = Array.isArray(category) ? { $in: category } : category;
  }

  if (fromYear || toYear) {
    filter.publicationYear = {};
    if (fromYear) filter.publicationYear.$gte = fromYear;
    if (toYear) filter.publicationYear.$lte = toYear;
  }

  const db = client.collection("books");

  const booksCount = await db.countDocuments();
  const books = await db.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const totalBooks = await db.countDocuments(filter);

  return {
    booksCount,
    books,
    total: totalBooks,
    page,
    totalPages: Math.ceil(totalBooks / limit),
  };
});
