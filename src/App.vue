<!--
 * @Descripttion: 
 * @Author: zengyuanqiu
 * @Date: 2024-04-20 11:33:58
 * @LastEditors: zengyuanqiu
 * @LastEditTime: 2024-07-17 15:47:29
-->
<template>
  <div class="app">
    <button @click="count--">-</button><span>{{ count }}</span
    ><button @click="count++">+</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

fetch('./data')
  .then(res => {
    try {
      return res.json()
    } catch (e) {
      return res.text()
    }
  })
  .then(res => {
    console.log(27)
    console.log(res)
  })
fetch('/data')
  .then(res => {
    try {
      return res.json()
    } catch (e) {
      return res.text()
    }
  })
  .then(res => {
    console.log(27)
    console.log(res)
  })
</script>

<style scoped></style>
