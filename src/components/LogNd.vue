<template>
  <div class="flex-1 p-20">
    <div class="flex">
      <button @click="getLog">刷新</button>&nbsp;<button @click="clearLog">
        清空日志
      </button>
      <div class="mx-auto pr-240">尼 斗</div>
    </div>

    <hr />
    <ul>
      <li v-for="(t, i) in logs" :key="i">
        <div>{{ t.date }}</div>
        <div>{{ t.val }}</div>
      </li>
    </ul>
  </div>
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

function clearLog() {
  logs.value = []
  fetch('/logs/nd?d=1')
}
</script>

<style scoped>
li {
  margin-top: 20px;
}
</style>
