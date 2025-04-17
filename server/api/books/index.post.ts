import { client } from "@/server/db";
import { BookInputSchema } from "~/server/schema";

export default defineEventHandler(async (event) => {
  const bodyRaw = await readBody(event);

  const parsed = BookInputSchema.safeParse(bodyRaw);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.errors.map((e) => e.message).join(", "),
    });
  }

  const body = parsed.data;
  const db = client;

  const categoriesCollection = db.collection("categories");
  const booksCollection = db.collection("books");

  // Find existing category slugs
  const existingCategories = await categoriesCollection
    .find({ slug: { $in: body.categories } })
    .toArray();

  const existingSlugs = existingCategories.map((cat) => cat.slug);
  const missingSlugs = body.categories.filter(
    (slug) => !existingSlugs.includes(slug),
  );

  if (missingSlugs.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Category slug(s) not found: ${missingSlugs.join(", ")}`,
    });
  }

  const bookToInsert = {
    ...body,
    createdAt: new Date(),
  };

  const result = await booksCollection.insertOne(bookToInsert);

  if (!result.acknowledged) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to insert book",
    });
  }

  return { insertedId: result.insertedId };
});
