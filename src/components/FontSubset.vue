<template>
  <div class="pt-80 pl-80">
    <input type="file" accept=".ttf" @change="onFontChange" />
    <br />
    <span class="text-12 color-[#909399]">请选择.ttf的字体文件</span>
    <br />
    <br />
    <textarea
      placeholder="请输入要生成子集的文字"
      cols="30"
      rows="10"
      v-model.lazy="text"
      class="p-12 max-w-1200 max-h-480"
    ></textarea>
    <br />
    <br />
    <button @click="start">开始</button>
  </div>
</template>

<script setup>
import { Font } from 'fonteditor-core'
import { ref } from 'vue'

const text = ref('')
let fontBuffer = null
function onFontChange({ target }) {
  const file = target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = function () {
    fontBuffer = reader.result
  }
}

function start() {
  const txt = text.value.replace(/[\r\n\s]/g, '')
  if (!fontBuffer || !txt) {
    return
  }
  const font = Font.create(fontBuffer, {
    type: 'ttf',
    subset: [...txt].map(t => t.charCodeAt(0)),
  })
  const subsetBuffer = font.write({ type: 'ttf' })
  const blob = new Blob([subsetBuffer], { type: 'font/ttf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `FONT-${Date.now()}.ttf`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
