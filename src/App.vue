<template>
  <component :is="Page"></component>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
const components = {
  Index: defineAsyncComponent(() => import('./components/Index.vue')),
  LogNd: defineAsyncComponent(() => import('./components/LogNd.vue')),
}

const Page = ref(components.Index)

function setPage() {
  const hash = location.hash.slice(1)
  if (components[hash]) {
    Page.value = components[hash]
  }
}
setPage()

window.addEventListener('hashchange', setPage)
</script>
