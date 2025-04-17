import { client } from "@/server/db";
import { DeleteCategorySchema } from "~/server/schema";

export default defineEventHandler(async (event) => {
  const bodyRaw = await readBody(event);
  const parseResult = DeleteCategorySchema.safeParse(bodyRaw);

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parseResult.error.errors.map((e) => e.message).join(
        ", ",
      ),
    });
  }

  const body = parseResult.data;
  const c1 = client.collection("categories");
  const c2 = client.collection("books");

  try {
    const tx1 = await c1.deleteOne({ slug: body.slug });

    if (tx1.deletedCount < 1) {
      throw createError({
        statusCode: 404,
        statusMessage: "Categories not found",
      });
    }

    const tx2 = await c2.updateMany(
      { categories: body.slug },
      { $pull: { categories: body.slug } as any },
    );

    event.node.res.statusCode = 204;
    return null;
  } catch (err) {
    console.error("MongoDB error during delete:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error during deletion",
    });
  }
});
