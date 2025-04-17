<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Navigation -->
      <nav class="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-8">
        <div class="flex justify-between items-center h-16 px-4">
          <NuxtLink to="/" class="text-2xl font-bold text-black hover:text-gray-600 transition-colors">
            Books Manager
          </NuxtLink>
          <div class="flex gap-4">
            <NuxtLink 
              v-if="$route.path !== '/'"
              @click="$router.back()"
              class="px-4 py-2 h-12 text-lg border-2 border-black hover:bg-black hover:text-white transition-all font-bold flex items-center cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="py-8">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template> 