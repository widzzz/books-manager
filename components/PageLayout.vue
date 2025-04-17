<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 v-if="title" class="text-3xl font-bold">{{ title }}</h1>
      <div>
        <slot name="header-right" />
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script> 