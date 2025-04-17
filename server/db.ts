import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// Get the MongoDB URI from environment variables
const uri = process.env.MONGODB_STRING;

if (!uri) {
  console.error("❌ MONGODB_STRING is not defined in environment variables.");
  process.exit(1); // Exit with failure code
}
export const client = new MongoClient(uri).db("bookshelf_database");
