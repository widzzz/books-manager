import { z } from 'zod'
import { client } from '../../db'
import { ObjectId } from 'mongodb'

const updateBookSchema = z.object({
  title: z.string().min(1),
  author: z.array(z.string().min(1)),
  publicationYear: z.number().int().min(1000).max(new Date().getFullYear()),
  publisher: z.string().min(1),
  pages: z.number().min(1),
  categories: z.array(z.string().min(1)),
  language: z.string().min(1),
  image: z.string().url(),
})

export default defineEventHandler(async (event) => {
  try {
    const db = client.collection('books')
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    // Validate the request body
    const validatedData = updateBookSchema.parse(body)

    // Update the book in the database
    const result = await db.updateOne(
      { _id: new ObjectId(id) },
      { $set: validatedData }
    )

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        message: 'Book not found'
      })
    }

    // Fetch the updated book
    const updatedBook = await db.findOne({ _id: new ObjectId(id) })

    return { success: true, book: updatedBook }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Invalid book data',
        data: error.errors
      })
    }
    throw error
  }
}) 