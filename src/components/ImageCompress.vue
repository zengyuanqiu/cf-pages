<template>
  <div class="mx-auto pt-120 w-640">
    <div
      class="relative flex-center h-480 color-[#606266] b b-dashed b-[#dcdfe6] rounded-8 hover:b-[#409eff]"
    >
      点击选择文件或将文件拖拽到此处
      <input
        type="file"
        multiple
        class="absolute inset-0 opacity-0 cursor-pointer"
        @change="onFileChange"
      />
    </div>
    <p class="color-[#909399]">
      压缩质量({{ $.quality }}%)：<input
        v-model="$.quality"
        type="range"
        min="10"
      />
    </p>
    <p ref="linkWrapper" class="color-[#909399] pl-5em indent--5em link-wrap">
      <!-- 点击下载： -->
      <!-- <a
        v-for="i in 12"
        href=""
        download=""
        class="mr-4 mb-4 px-8 pb-2 inline-block indent-0 b b-solid b-[#409eff] rounded-4"
        >abc.jpg</a
      > -->
    </p>
  </div>
</template>

<script setup>
import { ref, reactive, shallowRef } from 'vue'

const $ = reactive({
  quality: 70,
})

const linkWrapper = shallowRef()
function onFileChange({ target }) {
  ;[...target.files].forEach(compressImage)
  target.value = ''
}

function compressImage(file) {
  const image = new Image()
  image.src = URL.createObjectURL(file)
  image.onload = () => {
    const canvas = document.createElement('canvas')
    const w = (canvas.width = image.width)
    const h = (canvas.height = image.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, w, h)
    canvas.toBlob(
      blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.innerText = a.download = `${file.name}.jpg`
        a.className =
          'mr-4 mb-4 px-8 pb-2 inline-block indent-0 decoration-none b b-solid b-[#409eff] rounded-4'
        a.click()
        linkWrapper.value.appendChild(a)
        // URL.revokeObjectURL(url)
      },
      'image/jpeg',
      $.quality / 100
    )
  }
}
</script>

<style scoped>
.link-wrap:not(:empty)::before {
  content: '点击下载：';
}
</style>
