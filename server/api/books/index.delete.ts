import { client } from "@/server/db";
import { DeleteBooksSchema } from "~/server/schema";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  const bodyRaw = await readBody(event);
  const parseResult = DeleteBooksSchema.safeParse(bodyRaw);

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parseResult.error.errors.map((e) => e.message).join(
        ", ",
      ),
    });
  }

  const body = parseResult.data;
  const c = client.collection("books");

  try {
    const result = await c.deleteOne({ _id: new ObjectId(body.id) });

    if (result.deletedCount < 1) {
      throw createError({
        statusCode: 404,
        statusMessage: "Book not found",
      });
    }

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
