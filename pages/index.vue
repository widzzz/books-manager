<template>
  <PageLayout>
    <div class="space-y-8">
      <div class="text-center">
        <p class="text-2xl font-bold text-black">Manage your books and categories with ease</p>
      </div>

      <!-- Quick Stats Section -->
      <div class="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 class="text-3xl font-bold mb-4">Quick Stats</h2>
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-yellow-100 border-2 border-black gap-2 sm:gap-0">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="text-xl font-bold">Total Books</span>
            </div>
            <span class="text-2xl font-bold">{{ booksCount }}</span>
          </div>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-pink-100 border-2 border-black gap-2 sm:gap-0">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span class="text-xl font-bold">Total Categories</span>
            </div>
            <span class="text-2xl font-bold">{{ categories.length }}</span>
          </div>
        </div>
      </div>

      <!-- Books Section -->
      <div class="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 class="text-3xl font-bold">Books</h2>
          <div class="flex flex-wrap gap-4 justify-center sm:justify-end">
            <NuxtLink 
              to="/books/new" 
              class="px-4 py-2 h-12 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all flex items-center gap-2 font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Book
            </NuxtLink>
            <button 
              @click="showBookFilters = !showBookFilters"
              class="px-4 py-2 h-12 text-lg border-2 border-black hover:bg-black hover:text-white transition-all font-bold flex items-center"
            >
              {{ showBookFilters ? 'Hide Filters' : 'Show Filters' }}
            </button>
          </div>
        </div>

        <!-- Book Filters -->
        <div v-if="showBookFilters" class="mb-6 p-4 border-2 border-black bg-white">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="space-y-2">
              <label for="search" class="block text-lg font-bold">Search</label>
              <div class="relative">
                <input
                  id="search"
                  v-model="bookFilters.search"
                  placeholder="Search books..."
                  @input="debouncedSearch"
                  class="w-full pl-10 pr-3 py-2 h-12 text-lg border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Category -->
            <div class="space-y-2">
              <label for="category" class="block text-lg font-bold">Category</label>
              <select 
                v-model="bookFilters.category" 
                id="category"
                class="w-full px-3 py-2 h-12 text-lg border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 appearance-none bg-white"
                @change="handleCategoryChange"
              >
                <option value="" class="text-lg">All Categories</option>
                <option v-for="category in categories" :key="category._id" :value="category.slug" class="text-lg">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Date Range -->
            <div class="space-y-2">
              <label class="block text-lg font-bold">Publication Year</label>
              <div class="flex gap-2">
                <div class="flex-1">
                  <input
                    type="number"
                    v-model="bookFilters.fromYear"
                    @change="handleDateChange"
                    placeholder="From year"
                    class="w-full px-3 py-2 h-12 text-lg border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    :max="bookFilters.toYear || new Date().getFullYear()"
                  />
                </div>
                <div class="flex-1">
                  <input
                    type="number"
                    v-model="bookFilters.toYear"
                    @change="handleDateChange"
                    placeholder="To year"
                    class="w-full px-3 py-2 h-12 text-lg border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    :min="bookFilters.fromYear || 0"
                    :max="new Date().getFullYear()"
                  />
                </div>
              </div>
            </div>

            <!-- Clear Filters -->
            <div class="flex items-end">
              <button
                @click="clearBookFilters"
                class="w-full px-4 py-2 h-12 text-lg font-bold border-2 border-black hover:bg-black hover:text-white transition-all flex items-center justify-center"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <!-- Active Filters -->
          <div v-if="hasActiveBookFilters" class="mt-4 flex flex-wrap gap-2">
            <div 
              v-if="bookFilters.search"
              class="inline-flex items-center px-3 py-1 border-2 border-black bg-yellow-100 text-black font-bold"
            >
              Search: "{{ bookFilters.search }}"
              <button @click="bookFilters.search = ''; fetchBooks()" class="ml-2 hover:text-red-500">
                ×
              </button>
            </div>
            <div 
              v-if="bookFilters.category"
              class="inline-flex items-center px-3 py-1 border-2 border-black bg-pink-100 text-black font-bold"
            >
              Category: {{ getCategoryName(bookFilters.category) }}
              <button @click="bookFilters.category = ''; fetchBooks()" class="ml-2 hover:text-red-500">
                ×
              </button>
            </div>
            <div 
              v-if="bookFilters.fromYear || bookFilters.toYear"
              class="inline-flex items-center px-3 py-1 border-2 border-black bg-blue-100 text-black font-bold"
            >
              Year: {{ formatDateRange(bookFilters.fromYear, bookFilters.toYear) }}
              <button @click="clearDateFilters" class="ml-2 hover:text-red-500">
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Books Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="book in books" :key="book._id" class="border-2 border-black overflow-hidden hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div class="p-4">
              <h2 class="text-2xl font-bold mb-2">{{ book.title }}</h2>
              <p class="text-lg mb-4">
                {{ book.author.join(', ') }}
              </p>
              <img :src="book.image" :alt="book.title" class="w-full h-48 object-cover border-2 border-black mb-4" />
              <p class="text-lg">
                Published: {{ book.publicationYear }}
              </p>
              <p class="text-lg">Publisher: {{ book.publisher }}</p>
              <p class="text-lg">Pages: {{ book.pages }}</p>
            </div>
            <div class="p-4 border-t-2 border-black">
              <NuxtLink 
                :to="`/books/${book._id}?page=${currentPage}`"
                class="w-full px-4 py-2 h-12 border-2 border-black hover:bg-black hover:text-white transition-all flex items-center justify-center font-bold"
              >
                View Details
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-8 flex justify-center">
          <div class="flex gap-2">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page; fetchBooks()"
              :class="[
                'px-4 py-2 h-10 w-10 flex items-center justify-center border-2 font-bold',
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

      <!-- Categories Section -->
      <div class="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 class="text-3xl font-bold">Categories</h2>
          <NuxtLink 
            to="/categories/new"
            class="px-4 py-2 h-12 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all flex items-center gap-2 font-bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Category
          </NuxtLink>
        </div>

        <!-- Categories Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="category in categories" :key="category._id" class="border-2 border-black overflow-hidden hover:shadow-xl md:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div class="p-4">
              <h2 class="text-2xl font-bold mb-2">{{ category.name }}</h2>
              <p class="text-lg">{{ category.description }}</p>
            </div>
            <div class="p-4 border-t-2 border-black flex justify-end gap-2">
              <NuxtLink 
                :to="`/categories/${category.slug}`"
                class="px-4 py-2 h-12 border-2 border-black hover:bg-black hover:text-white transition-all flex items-center gap-2 font-bold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                View Details
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

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
}

const books = ref<Book[]>([])
const categories = ref<Category[]>([])
const booksCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const showBookFilters = ref(false)

const bookFilters = ref({
  search: '',
  category: '',
  fromYear: '',
  toYear: '',
})

const hasActiveBookFilters = computed(() => {
  return bookFilters.value.search || bookFilters.value.category || bookFilters.value.fromYear || bookFilters.value.toYear
})

const getCategoryName = (slug: string) => {
  const category = categories.value.find(c => c.slug === slug)
  return category ? category.name : ''
}

const formatDateRange = (from: string, to: string) => {
  if (from && to) return `${from} - ${to}`
  if (from) return `From ${from}`
  if (to) return `To ${to}`
  return ''
}

const fetchBooks = async () => {
  try {
    const queryParams = new URLSearchParams({
      page: currentPage.value.toString(),
      ...(bookFilters.value.search && { search: bookFilters.value.search }),
      ...(bookFilters.value.category && { category: bookFilters.value.category }),
      ...(bookFilters.value.fromYear && { fromYear: bookFilters.value.fromYear }),
      ...(bookFilters.value.toYear && { toYear: bookFilters.value.toYear }),
    })

    const response = await fetch(`/api/books?${queryParams}`)
    if (!response.ok) {
      throw new Error('Failed to fetch books')
    }
    const data = await response.json()
    books.value = data.books
    booksCount.value = data.booksCount
    totalPages.value = data.totalPages
  } catch (error) {
    console.error('Error fetching books:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories')
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    categories.value = await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1
  fetchBooks()
}, 300)

const handleCategoryChange = () => {
  currentPage.value = 1
  fetchBooks()
}

const handleDateChange = () => {
  currentPage.value = 1
  fetchBooks()
}

const clearBookFilters = () => {
  bookFilters.value = {
    search: '',
    category: '',
    fromYear: '',
    toYear: '',
  }
  currentPage.value = 1
  fetchBooks()
}

const clearDateFilters = () => {
  bookFilters.value.fromYear = ''
  bookFilters.value.toYear = ''
  currentPage.value = 1
  fetchBooks()
}

onMounted(() => {
  const route = useRoute()
  if (route.query.page) {
    currentPage.value = Number(route.query.page)
  }
  fetchBooks()
  fetchCategories()
})
</script> 