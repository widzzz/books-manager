import { client } from "@/server/db";

export default defineEventHandler(async (event) => {
  const db = client.collection("categories");
  return await db.find().toArray();
});
