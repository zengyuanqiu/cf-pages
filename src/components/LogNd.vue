<template>
  <ul>
    <li v-for="(t, i) in logs" :key="i">
      <div>{{ t.date }}</div>
      <div>{{ t.val }}</div>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'

const logs = ref([])

fetch('/logs/nd?r=1')
  .then(res => res.json())
  .then(res => {
    if (res?.data?.length) {
      logs.value = res.data.reverse()
    }
  })
</script>

<style scoped>
li {
  margin-top: 20px;
}
</style>
