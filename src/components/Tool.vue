<template>
  <div class="flex">
    <div
      class="p-20 w-240 h-90vh overflow-y-auto b-r b-r-solid b-color-[#ddd] no-scrollbar"
    >
      <div
        v-for="(btn, i) in btns"
        :key="i"
        class="mb-20 p-10 text-18 text-center bg-[#d9ecff] rounded-4 cursor-pointer press"
        @click="btnIndex = i"
      >
        {{ btn.name }}
      </div>
    </div>
    <component :is="CurrentComponent" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ImageCompress from './ImageCompress.vue'
import FontSubset from './FontSubset.vue'

const btns = [
  {
    name: '图片压缩',
    component: ImageCompress,
  },
  {
    name: '字体子集',
    component: FontSubset,
  },
]

const btnIndex = ref(0)

const CurrentComponent = computed(() => {
  return btns[btnIndex.value].component
})
</script>

<style scoped></style>
