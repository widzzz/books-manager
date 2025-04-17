import { ObjectId } from "mongodb";
import { client } from "~/server/db";

export default defineEventHandler(async (event) => {
  const params = event.context.params;

  if (!params || !params.id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing ID parameter",
    });
  }

  const id = params.id;

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid ID format",
    });
  }

  const db = client.collection("books");
  const result = await db.findOne({ _id: objectId });

  if (!result) {
    throw createError({ statusCode: 404 });
  }

  return result;
});
