<template>
  <PageLayout :title="isEditing ? `Edit ${book?.title || 'Book'}` : (book?.title || 'Book Details')">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>

    <div v-else-if="book && !isEditing">
      <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/3">
          <img :src="book.image" :alt="book.title" class="w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
        </div>
        <div class="md:w-2/3">
          <h1 class="text-4xl font-bold mb-4">{{ book.title }}</h1>
          <p class="text-2xl mb-6">By {{ book.author.join(', ') }}</p>
          
          <div class="space-y-6">
            <div class="p-6 border-2 border-black">
              <h2 class="text-2xl font-bold mb-4">Publication Details</h2>
              <p class="text-xl">Published: {{ book.publicationYear }}</p>
              <p class="text-xl">Publisher: {{ book.publisher }}</p>
              <p class="text-xl">Pages: {{ book.pages }}</p>
              <p class="text-xl">Language: {{ book.language }}</p>
            </div>

            <div class="p-6 border-2 border-black">
              <h2 class="text-2xl font-bold mb-4">Categories</h2>
              <div class="flex flex-wrap gap-2 mt-2">
                <span 
                  v-for="category in book.categories" 
                  :key="category" 
                  class="px-4 py-2 border-2 border-black text-xl font-bold"
                >
                  {{ category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="book && isEditing" class="max-w-2xl mx-auto p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="title" class="block text-xl font-bold mb-2">Title</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            required
          />
        </div>

        <div>
          <label class="block text-xl font-bold mb-2">Authors</label>
          <div v-for="(author, index) in form.author" :key="index" class="flex gap-2 mb-2">
            <input
              v-model="form.author[index]"
              type="text"
              class="flex-1 px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
              required
            />
            <button
              type="button"
              @click="removeAuthor(index)"
              class="px-3 py-2 text-red-500 hover:text-red-600 font-bold"
            >
              Remove
            </button>
          </div>
          <button
            type="button"
            @click="addAuthor"
            class="text-lg text-black hover:text-red-500 font-bold"
          >
            + Add Author
          </button>
        </div>

        <div>
          <label for="publicationYear" class="block text-xl font-bold mb-2">Publication Year</label>
          <input
            id="publicationYear"
            v-model.number="form.publicationYear"
            type="number"
            min="1000"
            :max="new Date().getFullYear()"
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            required
          />
        </div>

        <div>
          <label for="publisher" class="block text-xl font-bold mb-2">Publisher</label>
          <input
            id="publisher"
            v-model="form.publisher"
            type="text"
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            required
          />
        </div>

        <div>
          <label for="pages" class="block text-xl font-bold mb-2">Pages</label>
          <input
            id="pages"
            v-model.number="form.pages"
            type="number"
            min="1"
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="block text-xl font-bold">Categories</label>
          <div class="space-y-2 max-h-64 overflow-y-auto border-2 border-black p-4">
            <div v-for="category in categories" :key="category._id" class="flex items-center gap-2">
              <input
                type="checkbox"
                :id="category.slug"
                :value="category.slug"
                v-model="form.categories"
                class="w-5 h-5 border-2 border-black appearance-none checked:bg-black checked:border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 cursor-pointer relative checked:after:content-['✓'] checked:after:text-white checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-lg"
              />
              <label :for="category.slug" class="text-lg">
                {{ category.name }} ({{ category.slug }})
              </label>
            </div>
          </div>
          <div v-if="form.categories.length > 0" class="mt-2">
            <p class="text-sm font-medium">Selected Categories:</p>
            <div class="flex flex-wrap gap-2 mt-1">
              <span 
                v-for="categorySlug in form.categories" 
                :key="categorySlug"
                class="px-2 py-1 bg-gray-100 border-2 border-black text-sm"
              >
                {{ categories.find(c => c.slug === categorySlug)?.name }} ({{ categorySlug }})
              </span>
            </div>
          </div>
        </div>

        <div>
          <label for="language" class="block text-xl font-bold mb-2">Language</label>
          <input
            id="language"
            v-model="form.language"
            type="text"
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            required
          />
        </div>

        <div>
          <label for="image" class="block text-xl font-bold mb-2">Book Cover Image</label>
          <div class="space-y-4">
            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              @change="handleImageUpload"
              class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            />
            <div v-if="form.image" class="flex items-center gap-4">
              <img :src="form.image" alt="Preview" class="w-32 h-32 object-cover border-2 border-black" />
              <button
                type="button"
                @click="form.image = ''"
                class="px-3 py-2 text-red-500 hover:text-red-600 font-bold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

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
            :disabled="isSubmitting"
            class="px-4 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all font-bold disabled:opacity-50"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>

    <div v-else class="text-center">
      <h2 class="text-3xl font-bold">Book not found</h2>
      <NuxtLink 
        :to="`/?page=${$route.query.page || 1}`"
        class="mt-4 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all inline-flex items-center gap-2 font-bold"
      >
        <Icon name="heroicons:arrow-left" class="h-5 w-5" />
        Back
      </NuxtLink>
    </div>

    <template #header-right>
      <div class="flex gap-2">
        <button
          v-if="!isEditing && book"
          @click="deleteBook"
          class="px-4 py-2 bg-red-500 text-white border-2 border-black hover:bg-white hover:text-red-500 transition-all flex items-center gap-2 font-bold"
        >
          <Icon name="heroicons:trash" class="h-5 w-5" />
          Delete Book
        </button>
        <button
          v-if="!isEditing && book"
          @click="startEdit"
          class="px-4 py-2 bg-yellow-500 text-white border-2 border-black hover:bg-white hover:text-yellow-500 transition-all flex items-center gap-2 font-bold"
        >
          <Icon name="heroicons:pencil" class="h-5 w-5" />
          Edit Book
        </button>
      </div>
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const { id } = useRoute().params
const route = useRoute()
const book = ref<Book | null>(null)
const loading = ref(true)
const isEditing = ref(false)
const isSubmitting = ref(false)
const categories = ref<Category[]>([])

const form = ref({
  title: '',
  author: [''],
  publicationYear: new Date().getFullYear(),
  publisher: '',
  pages: 1,
  categories: [] as string[],
  language: '',
  image: '',
})

const fetchBook = async () => {
  try {
    loading.value = true
    const response = await fetch(`/api/books/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch book')
    }
    const fetchedBook = await response.json()
    book.value = fetchedBook
    
    form.value = {
      title: fetchedBook.title,
      author: Array.isArray(fetchedBook.author) ? [...fetchedBook.author] : [fetchedBook.author || ''],
      publicationYear: fetchedBook.publicationYear,
      publisher: fetchedBook.publisher,
      pages: fetchedBook.pages,
      categories: [...fetchedBook.categories],
      language: fetchedBook.language,
      image: fetchedBook.image || '',
    }
    if (form.value.author.length === 0) {
      form.value.author.push('');
    }
  } catch (error) {
    console.error('Error fetching book:', error)
    book.value = null
  } finally {
    loading.value = false
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

const addAuthor = () => {
  form.value.author.push('')
}

const removeAuthor = (index: number) => {
  if (form.value.author.length > 1) {
    form.value.author.splice(index, 1)
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    
    const response = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form.value,
        author: form.value.author.filter(a => a.trim() !== '')
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update book and parse error response.' }))
      throw new Error(errorData.message || 'Failed to update book')
    }
    
    await fetchBook()
    isEditing.value = false 
  } catch (error) {
    console.error('Error updating book:', error)
    alert(error instanceof Error ? error.message : 'Failed to update book. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  
  if (file.size > 5 * 1024 * 1024) {
    alert('File size exceeds the limit of 5MB')
    input.value = ''
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to upload image and parse error response.' }))
      throw new Error(error.message || 'Failed to upload image')
    }

    const data = await response.json()
    form.value.image = data.url
  } catch (error) {
    console.error('Error uploading image:', error)
    alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.')
    input.value = ''
  }
}

const startEdit = () => {
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  if (book.value) {
    form.value = {
      title: book.value.title,
      author: Array.isArray(book.value.author) ? [...book.value.author] : [book.value.author || ''],
      publicationYear: book.value.publicationYear,
      publisher: book.value.publisher,
      pages: book.value.pages,
      categories: [...book.value.categories],
      language: book.value.language,
      image: book.value.image || '',
    }
    if (form.value.author.length === 0) {
      form.value.author.push('');
    }
  }
}

const deleteBook = async () => {
  if (!confirm('Are you sure you want to delete this book?')) return

  try {
    const response = await fetch('/api/books', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    if (response.ok) {
      navigateTo(`/?page=${route.query.page || 1}`)
    } else {
      throw new Error('Failed to delete book')
    }
  } catch (error) {
    console.error('Error deleting book:', error)
    alert('Failed to delete book. Please try again.')
  }
}

onMounted(() => {
  fetchBook()
  fetchCategories()
})
</script> 