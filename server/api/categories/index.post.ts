import { client } from "@/server/db";
import s from "slug";
import { CategoryInputSchema } from "../../schema";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  const bodyRaw = await readBody(event);
  const parseResult = CategoryInputSchema.safeParse(bodyRaw);

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parseResult.error.errors.map((e) => e.message).join(", "),
    });
  }

  const body = parseResult.data;
  const cCategories = client.collection("categories");
  const cBooks = client.collection("books");

  let baseSlug = body.slug ?? s(body.name);
  let slug = baseSlug;

  if (body.slug) {
    // Explicit slug: reject if it already exists
    const existing = await cCategories.findOne({ slug });
    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: "Slug already exists",
      });
    }
  } else {
    // Auto-generated slug: try to find a unique one
    let counter = 1;
    while (await cCategories.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }
  }

  const newCategoryData = { name: body.name, description: body.description, slug };
  const result = await cCategories.insertOne(newCategoryData);

  if (!result.acknowledged) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to insert category",
    });
  }

  // Handle adding books if provided
  if (body.addBooks && body.addBooks.length > 0) {
    try {
      const bookIds = body.addBooks.map(id => new ObjectId(id));
      
      // Verify that all books exist
      const existingBooks = await cBooks.countDocuments({ _id: { $in: bookIds } });
      if (existingBooks !== body.addBooks.length) {
        // Rollback category creation? For now, just error out
        // await cCategories.deleteOne({ _id: result.insertedId }); // Optional rollback
        throw createError({
          statusCode: 400, // Bad request as some book IDs are invalid
          statusMessage: "One or more book IDs provided are invalid",
        });
      }

      // Add the new category slug to the selected books
      await cBooks.updateMany(
        { _id: { $in: bookIds } },
        { $addToSet: { categories: slug } }
      );
    } catch (error) {
      // Handle potential ObjectId errors or database errors
      // await cCategories.deleteOne({ _id: result.insertedId }); // Optional rollback
      console.error("Error updating books with new category:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to associate books with the new category",
      });
    }
  }

  return { inserted: slug };
});
