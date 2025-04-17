import { z } from 'zod'
import { client } from '../../db'
import { ObjectId } from 'mongodb'

const updateCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  // slug: z.string().min(1), // slug is not allowed to be changed
  addBooks: z.array(z.string()),
  removeBooks: z.array(z.string()),
})

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    // Validate the request body
    const validatedData = updateCategorySchema.parse(body)

    const cCategories = client.collection('categories')
    const cBooks = client.collection('books')

    // Check if category exists
    const category = await cCategories.findOne({ _id: new ObjectId(id) })
    if (!category) {
      throw createError({
        statusCode: 404,
        message: 'Category not found'
      })
    }

    // Only proceed with book operations if there are books to add/remove
    if (validatedData.addBooks.length > 0) {
      // Check if all books to add exist
      const booksToAdd = await cBooks.find({
        _id: { $in: validatedData.addBooks.map(id => new ObjectId(id)) }
      }).toArray()
      
      if (booksToAdd.length !== validatedData.addBooks.length) {
        throw createError({
          statusCode: 404,
          message: 'One or more books to add not found'
        })
      }

      // Update books collection to add category
      await cBooks.updateMany(
        { _id: { $in: validatedData.addBooks.map(id => new ObjectId(id)) } },
        { $addToSet: { categories: category.slug } }
      )
    }

    if (validatedData.removeBooks.length > 0) {
      // Check if all books to remove exist
      const booksToRemove = await cBooks.find({
        _id: { $in: validatedData.removeBooks.map(id => new ObjectId(id)) }
      }).toArray()
      
      if (booksToRemove.length !== validatedData.removeBooks.length) {
        throw createError({
          statusCode: 404,
          message: 'One or more books to remove not found'
        })
      }

      // Update books collection to remove category
      await cBooks.updateMany(
        { _id: { $in: validatedData.removeBooks.map(id => new ObjectId(id)) } },
        { $pull: { categories: category.slug } }
      )
    }

    // Update the category in the database
    const result = await cCategories.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          name: validatedData.name,
          description: validatedData.description
        }
      }
    )

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        message: 'Category not found'
      })
    }

    const updatedCategory = await cCategories.findOne({ _id: new ObjectId(id) })

    return { success: true, category: updatedCategory }
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