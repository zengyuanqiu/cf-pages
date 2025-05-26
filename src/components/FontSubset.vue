<template>
  <div class="pt-80 pl-80">
    <input type="file" accept=".ttf" @change="onFontChange" />
    <br />
    <span class="text-12 color-[#909399]">请选择.ttf的字体文件</span>
    <br />
    <br />
    <textarea
      placeholder="子集文字"
      cols="30"
      rows="10"
      v-model.lazy="text"
      class="p-12 max-w-1200 max-h-480"
    ></textarea>
    <br />
    <br />
    <button @click="create">生成子集</button>&nbsp;<button @click="look">
      查看子集
    </button>
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

function create() {
  const txt = text.value.replace(/[\r\n\s]/g, '')
  if (!fontBuffer || !txt) {
    return
  }
  const subsetBuffer = Font.create(fontBuffer, {
    type: 'ttf',
    subset: [...txt].map(t => t.charCodeAt(0)),
  }).write({ type: 'ttf' })
  const blob = new Blob([subsetBuffer], { type: 'font/ttf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `FONT-${Date.now()}.ttf`
  a.click()
  URL.revokeObjectURL(url)
}

function look() {
  if (!fontBuffer) return
  text.value = Font.create(fontBuffer, {
    type: 'ttf',
  })
    .get()
    .glyf.filter(t => t.unicode)
    .map(t => {
      return t.unicode.map(u => String.fromCharCode(u)).join('')
    })
    .join('')
}
</script>
