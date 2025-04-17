<template>
  <PageLayout title="Add New Category">
    <div class="max-w-2xl mx-auto p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Name -->
        <div>
          <label for="name" class="block text-xl font-bold mb-2">Name</label>
          <input
            id="name"
            v-model="categoryForm.name"
            type="text"
            required
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-xl font-bold mb-2">Description</label>
          <textarea
            id="description"
            v-model="categoryForm.description"
            required
            rows="4"
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
          ></textarea>
        </div>

        <!-- Add Books -->
        <div>
          <h2 class="text-xl font-bold mb-2">Add Books to Category (Optional)</h2>
          <div v-if="loadingBooks" class="text-gray-500 italic">Loading books...</div>
          <div v-else-if="availableBooks.length === 0" class="text-gray-500 italic">
            No books available or failed to load books.
          </div>
          <div v-else class="space-y-2 max-h-64 overflow-y-auto border-2 border-black p-4">
            <div v-for="book in availableBooks" :key="book._id" class="flex items-center gap-2">
              <input
                type="checkbox"
                :id="`add-${book._id}`"
                :value="book._id"
                v-model="categoryForm.addBooks"
                class="w-5 h-5 border-2 border-black appearance-none checked:bg-green-500 checked:border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 cursor-pointer relative checked:after:content-['✓'] checked:after:text-white checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-lg"
              />
              <label :for="`add-${book._id}`" class="text-lg flex-1">
                {{ book.title }} <span class="text-sm text-gray-500">({{ book.author.join(', ') }})</span>
              </label>
            </div>
          </div>
          <p v-if="categoryForm.addBooks.length > 0" class="mt-2 text-sm text-green-500">
            Selected {{ categoryForm.addBooks.length }} book(s) to add
          </p>
        </div>

        <!-- Submit Button -->
        <div class="flex flex-col sm:flex-row justify-end gap-4">
          <button
            type="button"
            @click="navigateTo('/')"
            class="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all font-bold"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Copied Book interface (adjust if needed based on your actual Book type)
interface Book {
  _id: string
  title: string
  author: string[]
  publicationYear: number
  publisher: string
  pages: number
  categories: string[]
  language: string
  image: string
}

const loadingBooks = ref(true)
const allBooks = ref<Book[]>([])

const categoryForm = ref({
  name: '',
  description: '',
  addBooks: [] as string[], // Added addBooks array
})

const availableBooks = computed(() => allBooks.value)

const fetchBooks = async () => {
  loadingBooks.value = true
  try {
    const response = await fetch('/api/books?all=true') 
    if (!response.ok) {
      throw new Error('Failed to fetch books')
    }
    const responseData = await response.json()

    if (responseData && Array.isArray(responseData.books)) {
      allBooks.value = responseData.books
    } else if (Array.isArray(responseData)) {
      allBooks.value = responseData
    } else {
      console.warn('Unexpected response structure from /api/books:', responseData)
      allBooks.value = [] 
    }
  } catch (error) {
    console.error('Error fetching books:', error)
    allBooks.value = [] // Ensure it's an array even on error
  } finally {
    loadingBooks.value = false
  }
}

const handleSubmit = async () => {
  try {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ensure the entire form including addBooks is sent
      body: JSON.stringify(categoryForm.value), 
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to add category')
    }

    // Optionally, clear the form or navigate
    // categoryForm.value = { name: '', description: '', addBooks: [] }; 
    navigateTo('/') // Navigate home after successful creation
  } catch (error) {
    console.error('Error adding category:', error)
    alert(error instanceof Error ? error.message : 'Failed to add category')
  }
}

// Fetch books when the component is mounted
onMounted(() => {
  fetchBooks()
})
</script> 