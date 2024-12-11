<template>
  <button @click="getLog">刷新</button>
  <hr />
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

function getLog() {
  fetch('/logs/nd?r=1')
    .then(res => res.json())
    .then(res => {
      if (res?.data?.length) {
        logs.value = res.data.reverse().map(t => {
          t.date = new Date(t.date).toLocaleString()
          return t
        })
      }
    })
}
getLog()
</script>

<style scoped>
li {
  margin-top: 20px;
}
</style>
