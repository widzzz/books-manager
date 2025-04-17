import { client } from "@/server/db";

export default defineEventHandler(async (event) => {
  const params = event.context.params;
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = 6;

  if (!params || !params.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing ID parameter",
    });
  }

  const slug = params.id;
  const category = client.collection("categories");
  const books = client.collection("books");

  const categoriesResult = await category.findOne({ slug });
  if (!categoriesResult) {
    throw createError({ statusCode: 404 });
  }

  const bookList = await books
    .find({ categories: slug })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const totalBooks = await books.countDocuments({ categories: slug });

  return {
    ...categoriesResult,
    books: bookList,
    total: totalBooks,
    page,
    totalPages: Math.ceil(totalBooks / limit),
  };
});
