<!--
 * @Descripttion: 
 * @Author: zengyuanqiu
 * @Date: 2024-04-20 11:33:58
 * @LastEditors: zengyuanqiu
 * @LastEditTime: 2024-07-17 14:10:36
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
</script>

<style scoped></style>
