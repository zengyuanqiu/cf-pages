/*
 * @Descripttion:
 * @Author: zengyuanqiu
 * @Date: 2024-04-20 11:33:58
 * @LastEditors: zengyuanqiu
 * @LastEditTime: 2025-02-22 08:42:06
 */
// import 'virtual:uno.css'
import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import JsonViewer from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'
import 'virtual:uno.css'
createApp(App).use(JsonViewer).mount('#app')
