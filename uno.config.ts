/*
 * @Descripttion:
 * @Author: zengyuanqiu
 * @Date: 2024-04-24 19:40:06
 * @LastEditors: zengyuanqiu
 * @LastEditTime: 2025-02-22 08:38:39
 */
import { presetRemToPx } from '@unocss/preset-rem-to-px'
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  rules: [],
  presets: [
    presetUno(), // 默认预设必须加上
    presetRemToPx({
      baseFontSize: 4,
    }),
  ],
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-x-center': 'flex items-center',
    },
  ],
})
