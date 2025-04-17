<template>
  <PageLayout title="Add New Book">
    <div class="max-w-2xl mx-auto p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h1 class="text-4xl font-bold mb-8">Add New Book</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-xl font-bold mb-2">Title</label>
          <input
            id="title"
            v-model="bookForm.title"
            type="text"
            required
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
          />
        </div>

        <!-- Authors -->
        <div>
          <label for="authors" class="block text-xl font-bold mb-2">Authors</label>
          <div class="space-y-2">
            <div v-for="(author, index) in bookForm.author" :key="index" class="flex gap-2">
              <input
                v-model="bookForm.author[index]"
                type="text"
                required
                class="flex-1 px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
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
        </div>

        <!-- Publication Year -->
        <div>
          <label for="publicationYear" class="block text-xl font-bold mb-2">Publication Year</label>
          <input
            id="publicationYear"
            v-model.number="bookForm.publicationYear"
            type="number"
            min="1000"
            :max="new Date().getFullYear()"
            required
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
          />
        </div>

        <!-- Publisher -->
        <div>
          <label for="publisher" class="block text-xl font-bold mb-2">Publisher</label>
          <input
            id="publisher"
            v-model="bookForm.publisher"
            type="text"
            required
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
          />
        </div>

        <!-- Pages -->
        <div>
          <label for="pages" class="block text-xl font-bold mb-2">Pages</label>
          <input
            id="pages"
            v-model.number="bookForm.pages"
            type="number"
            min="1"
            required
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
          />
        </div>

        <!-- Categories -->
        <div class="space-y-2">
          <label class="block text-xl font-bold">Categories</label>
          <div class="space-y-2 max-h-64 overflow-y-auto border-2 border-black p-4">
            <div v-for="category in categories" :key="category._id" class="flex items-center gap-2">
              <input
                type="checkbox"
                :id="category.slug"
                :value="category.slug"
                v-model="bookForm.categories"
                class="w-5 h-5 border-2 border-black appearance-none checked:bg-black checked:border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 cursor-pointer relative checked:after:content-['✓'] checked:after:text-white checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-lg"
              />
              <label :for="category.slug" class="text-lg">
                {{ category.name }} ({{ category.slug }})
              </label>
            </div>
          </div>
          <div v-if="bookForm.categories.length > 0" class="mt-2">
            <p class="text-sm font-medium">Selected Categories:</p>
            <div class="flex flex-wrap gap-2 mt-1">
              <span 
                v-for="categorySlug in bookForm.categories" 
                :key="categorySlug"
                class="px-2 py-1 bg-gray-100 border-2 border-black text-sm"
              >
                {{ categories.find(c => c.slug === categorySlug)?.name }} ({{ categorySlug }})
              </span>
            </div>
          </div>
        </div>

        <!-- Language -->
        <div>
          <label for="language" class="block text-xl font-bold mb-2">Language</label>
          <input
            id="language"
            v-model="bookForm.language"
            type="text"
            required
            class="w-full px-3 py-2 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
          />
        </div>

        <!-- Image Upload -->
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
            <div v-if="bookForm.image" class="flex items-center gap-4">
              <img :src="bookForm.image" alt="Preview" class="w-32 h-32 object-cover border-2 border-black" />
              <button
                type="button"
                @click="bookForm.image = ''"
                class="px-3 py-2 text-red-500 hover:text-red-600 font-bold"
              >
                Remove
              </button>
            </div>
          </div>
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
            Add Book
          </button>
        </div>
      </form>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Category {
  _id: string
  name: string
  description: string
  slug: string
}

const categories = ref<Category[]>([])

const bookForm = ref({
  title: '',
  author: [''],
  publicationYear: 0,
  publisher: '',
  pages: 0,
  categories: [] as string[],
  language: '',
  image: '',
})

const addAuthor = () => {
  bookForm.value.author.push('')
}

const removeAuthor = (index: number) => {
  bookForm.value.author.splice(index, 1)
}

const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories')
    categories.value = await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const handleSubmit = async () => {
  try {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookForm.value),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to add book')
    }

    navigateTo('/')
  } catch (error) {
    console.error('Error adding book:', error)
    alert(error instanceof Error ? error.message : 'Failed to add book')
  }
}

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  
  // Check file size (5MB limit)
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
      const error = await response.json()
      throw new Error(error.message || 'Failed to upload image')
    }

    const data = await response.json()
    console.log('Upload response:', data)
    
    if (!data.url) {
      throw new Error('No URL returned from upload')
    }

    // Set the image URL directly
    bookForm.value.image = data.url
    console.log('Set image URL:', bookForm.value.image)

  } catch (error) {
    console.error('Error uploading image:', error)
    alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.')
    input.value = ''
  }
}

onMounted(() => {
  fetchCategories()
})
</script> 