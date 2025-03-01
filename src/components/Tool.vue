<template>
  <div class="flex">
    <div
      class="p-20 w-240 h-90vh overflow-y-auto b-r b-r-solid b-color-[#ddd] no-scrollbar"
    >
      <div
        class="p-10 text-18 text-center bg-[#d9ecff] rounded-4 cursor-pointer press"
      >
        图片压缩
      </div>
    </div>
    <ImageCompress />
  </div>
</template>

<script setup>
import ImageCompress from './ImageCompress.vue'
</script>

<style scoped></style>
