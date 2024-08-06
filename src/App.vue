<!--
 * @Descripttion: 
 * @Author: zengyuanqiu
 * @Date: 2024-04-20 11:33:58
 * @LastEditors: zengyuanqiu
 * @LastEditTime: 2024-08-06 16:43:27
-->
<template>
  <div class="app">
    <!-- <button @click="count--">-</button><span>{{ count }}</span
    ><button @click="count++">+</button> -->
    <!-- <canvas
      width="400"
      height="400"
      id="canvas"
      style="border: 1px solid #ccc"
    ></canvas> -->
    Hello {{ message }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('World')

// const fabric = window.fabric
</script>

<style scoped></style>
