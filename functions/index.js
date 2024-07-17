/*
 * @Descripttion:
 * @Author: zengyuanqiu
 * @Date: 2024-07-17 15:06:11
 * @LastEditors: zengyuanqiu
 * @LastEditTime: 2024-07-17 15:08:59
 */
export function onRequest(context) {
  console.log('已执行')
  return new Response('Hello, world!')
}
