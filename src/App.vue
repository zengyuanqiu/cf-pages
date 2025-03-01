<template>
  <component :is="Page"></component>
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue'
const components = {
  index: defineAsyncComponent(() => import('./components/Index.vue')),
  log: defineAsyncComponent(() => import('./components/Log.vue')),
  tool: defineAsyncComponent(() => import('./components/Tool.vue')),
}

const Page = shallowRef(components.index)

function setPage() {
  let name = location.hash.slice(1) || location.pathname.slice(1)
  Page.value = components[name] || components.index
}
setPage()

window.addEventListener('hashchange', () => {
  setPage()
})

window.addEventListener('popstate', () => {
  setPage()
})
</script>

<style>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-x-center {
  display: flex;
  align-items: center;
}

.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.press {
  position: relative;
}
.press:active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background-color: #000;
  opacity: 0.15;
}
</style>
