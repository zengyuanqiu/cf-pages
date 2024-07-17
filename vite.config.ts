/*
 * @Descripttion:
 * @Author: zengyuanqiu
 * @Date: 2024-04-20 11:33:46
 * @LastEditors: zengyuanqiu
 * @LastEditTime: 2024-04-24 19:52:01
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), vue()],
})
