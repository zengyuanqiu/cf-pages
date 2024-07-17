/*
 * @Descripttion:
 * @Author: zengyuanqiu
 * @Date: 2024-04-24 19:40:06
 * @LastEditors: zengyuanqiu
 * @LastEditTime: 2024-04-24 19:42:11
 */
import { defineConfig } from 'unocss'

export default defineConfig({
  preprocess: [
    s => {
      console.log(s)
      return s
    },
  ],
})
