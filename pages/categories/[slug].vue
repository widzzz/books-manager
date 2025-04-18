<template>
  <PageLayout :title="category?.name || 'Category Details'">
    <!-- Header with Actions - Removed as duplicates -->
    <!--
    <div class="flex justify-between items-center mb-6" v-if="category && !loading">
      <h1 class="text-4xl font-bold">{{ category.name }}</h1>
      <div class="flex gap-4">
        <button
          v-if="!isEditing"
          @click="startEdit"
          class="px-4 py-2 bg-black text-white border-4 border-black hover:bg-white hover:text-black transition-all font-bold flex items-center gap-2"
        >
          <Icon name="heroicons:pencil-square" class="h-5 w-5" />
          Edit Category
        </button>
      </div>
    </div>
    -->

    <div v-if="loading" class="text-center">
      <p class="text-2xl font-bold">Loading...</p>
    </div>

    <div v-else-if="category">
      <!-- Edit Form -->
      <div v-if="isEditing" class="max-w-2xl mx-auto p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
        <h1 class="text-4xl font-bold mb-8">Edit Category: {{ category.name }}</h1>

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
              rows="4"
              required
              class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            ></textarea>
          </div>

          <!-- Books Management -->
          <div>
            <h2 class="text-xl font-bold mb-2">Manage Books</h2>
            
            <!-- Books in Category -->
            <div class="mb-4">
              <h3 class="text-lg font-semibold mb-2">Current Books in Category</h3>
              <div v-if="booksInCategory.length === 0" class="text-gray-500 italic">
                No books in this category
              </div>
              <div v-else class="space-y-2 max-h-64 overflow-y-auto border-2 border-black p-4">
                <div v-for="book in booksInCategory" :key="book._id" class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :id="`remove-${book._id}`"
                    :value="book._id"
                    v-model="categoryForm.removeBooks"
                    class="w-5 h-5 border-2 border-black appearance-none checked:bg-red-500 checked:border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 cursor-pointer relative checked:after:content-['✓'] checked:after:text-white checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-lg"
                  />
                  <label :for="`remove-${book._id}`" class="text-lg flex-1">
                    {{ book.title }} <span class="text-sm text-gray-500">({{ book.author.join(', ') }})</span>
                  </label>
                </div>
              </div>
              <p v-if="categoryForm.removeBooks.length > 0" class="mt-2 text-sm text-red-500">
                Selected {{ categoryForm.removeBooks.length }} book(s) to remove
              </p>
            </div>
            
            <!-- Available Books to Add -->
            <div>
              <h3 class="text-lg font-semibold mb-2">Available Books to Add</h3>
              <div v-if="availableBooks.length === 0" class="text-gray-500 italic">
                No additional books available
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
          </div>

          <!-- Submit Button -->
          <div class="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all font-bold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <!-- Category Details -->
      <div v-else class="mb-8 p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <p class="text-xl">{{ category.description }}</p>
      </div>

      <!-- Books Management Grid -->
      <div v-if="!isEditing" class="mb-8">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 class="text-3xl font-bold">Books in this Category</h2>
        </div>

        <!-- Current Books Grid -->
        <div v-if="booksInCategoryDisplay.length === 0" class="text-center text-2xl font-bold">
          <p>No books found in this category.</p>
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            v-for="book in booksInCategoryDisplay"
            :key="book._id"
            class="border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <img 
              :src="book.image || '/placeholder-image.jpg'" 
              :alt="book.title + ' cover'"
              class="w-full h-64 object-cover mb-4 border-2 border-black"
            />
            <h3 class="text-xl font-bold mb-2">{{ book.title }}</h3>
            <p class="text-gray-600 mb-4">{{ book.author.join(", ") }}</p>
            <div class="flex gap-2">
              <button
                @click="navigateTo(`/books/${book._id}`)"
                class="flex-1 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-bold"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="category.totalPages > 1" class="flex justify-center">
        <div class="flex gap-2">
          <button
            v-for="page in category.totalPages"
            :key="page"
            @click="currentPage = page; fetchCategory()"
            :class="[
              'px-4 py-2 border-2 font-bold',
              currentPage === page 
                ? 'bg-black text-white border-black' 
                : 'border-black hover:bg-black hover:text-white'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center">
      <h2 class="text-3xl font-bold">Category not found</h2>
      <button 
        @click="navigateTo('/')"
        class="mt-4 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all font-bold"
      >
        Back
      </button>
    </div>

    <template #header-right>
      <div class="flex gap-2">
        <button 
          v-if="category && !isEditing"
          @click="deleteCategory"
          class="px-4 py-2 bg-red-500 text-white border-2 border-black hover:bg-white hover:text-red-500 transition-all flex items-center gap-2 font-bold"
        >
          <Icon name="heroicons:trash" class="h-5 w-5" />
          Delete Category
        </button>
        <button 
          v-if="category && !isEditing"
          @click="startEdit"
          class="px-4 py-2 bg-yellow-500 text-white border-2 border-black hover:bg-white hover:text-yellow-500 transition-all flex items-center gap-2 font-bold"
        >
          <Icon name="heroicons:pencil-square" class="h-5 w-5" />
          Edit Category
        </button>
      </div>
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

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

interface Category {
  _id: string
  name: string
  description: string
  slug: string
  books: Book[]
  total: number
  page: number
  totalPages: number
}

const route = useRoute()
const loading = ref(true)
const category = ref<Category | null>(null)
const isEditing = ref(false)
const currentPage = ref(1)
const allBooks = ref<Book[]>([])

const categoryForm = ref({
  name: '',
  description: '',
  addBooks: [] as string[],
  removeBooks: [] as string[]
})

const booksInCategory = computed(() => {
  if (!category.value?.books) return []
  
  // Use the same books that are displayed in the category details view
  return category.value.books
})

const availableBooks = computed(() => {
  if (!allBooks.value || allBooks.value.length === 0 || !category.value?.books) return []
  
  // Show books that are not already in the category.books array
  const categoryBookIds = category.value.books.map(book => book._id)
  return allBooks.value.filter(book => !categoryBookIds.includes(book._id))
})

// Add a computed property for displaying books when *not* editing
// to avoid conflict with the computed properties used by the edit form
const booksInCategoryDisplay = computed(() => {
  if (!category.value?.books) return []
  return category.value.books
})

const fetchCategory = async () => {
  try {
    const response = await fetch(`/api/categories/${route.params.slug}?page=${currentPage.value}`)
    if (!response.ok) {
      throw new Error('Failed to fetch category')
    }
    category.value = await response.json()
  } catch (error) {
    console.error('Error fetching category:', error)
    category.value = null
  } finally {
    loading.value = false
  }
}

const fetchBooks = async () => {
  try {
    // Fetching all books for the edit form logic
    const response = await fetch('/api/books?all=true') // Assuming an 'all=true' param fetches all books
    if (!response.ok) {
      throw new Error('Failed to fetch books')
    }
    const responseData = await response.json()

    // Check if the responseData has a 'books' property and it is an array
    if (responseData && Array.isArray(responseData.books)) {
      allBooks.value = responseData.books
      console.log('Fetched books:', responseData.books) // Log the actual array
      console.log('Books categories:', responseData.books.map((b: Book) => b.categories))
    } else if (Array.isArray(responseData)) {
      // Handle case where the API might just return the array directly
      allBooks.value = responseData
      console.log('Fetched books (direct array):', responseData)
      console.log('Books categories:', responseData.map((b: Book) => b.categories))
    } else {
      // Handle unexpected structures
      console.warn('Unexpected response structure from /api/books:', responseData)
      allBooks.value = [] // Set to empty array to avoid errors
    }

    console.log('Current slug:', route.params.slug)
  } catch (error) {
    console.error('Error fetching books:', error)
    allBooks.value = [] // Ensure it's an array even on error
  }
}

const startEdit = async () => {
  isEditing.value = true
  
  // First, initialize the form with current category data
  if (category.value) {
    categoryForm.value = {
      name: category.value.name,
      description: category.value.description,
      addBooks: [],
      removeBooks: []
    }
  }
  
  // Then fetch all books to populate the book lists
  await fetchBooks()
  
  // Debug logs
  console.log('Category data:', category.value)
  console.log('All books:', allBooks.value)
  console.log('Books in category:', booksInCategory.value)
  console.log('Available books:', availableBooks.value)
}

const cancelEdit = () => {
  isEditing.value = false
  categoryForm.value = {
    name: '',
    description: '',
    addBooks: [],
    removeBooks: []
  }
}

const handleSubmit = async () => {
  if (!category.value) return

  try {
    const response = await fetch(`/api/categories/${category.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryForm.value),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update category')
    }

    // Refresh category data and exit edit mode
    await fetchCategory()
    isEditing.value = false
  } catch (error) {
    console.error('Error updating category:', error)
    alert(error instanceof Error ? error.message : 'Failed to update category')
  }
}

const deleteCategory = async () => {
  if (!category.value) return
  
  if (!confirm("Are you sure you want to delete this category? Don't worry — the books will remain in your library.")) return

  try {
    const response = await fetch('/api/categories', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug: category.value.slug }),
    })

    if (!response.ok) {
      throw new Error('Failed to delete category')
    }

    // Navigate back to home page after successful deletion
    navigateTo('/')
  } catch (error) {
    console.error('Error deleting category:', error)
    alert('Failed to delete category')
  }
}

onMounted(() => {
  fetchCategory()
})
</script> 