<template>
  <div class="flex">
    <div
      class="sticky top-8 p-20 w-240 min-w-240 h-90vh overflow-y-auto b-r b-r-solid b-color-[#ddd] no-scrollbar"
    >
      <div
        class="p-10 text-18 text-center bg-[#d9ecff] rounded-4 cursor-pointer press"
      >
        尼斗
      </div>
    </div>
    <LogNd />
  </div>
</template>

<script setup>
import LogNd from './LogNd.vue'
</script>

<style scoped></style>
