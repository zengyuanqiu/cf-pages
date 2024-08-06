/*
 * @Descripttion:
 * @Author: zengyuanqiu
 * @Date: 2024-07-17 15:06:11
 * @LastEditors: zengyuanqiu
 * @LastEditTime: 2024-07-17 15:45:13 AQ1Z95WO7I9
 */
export function onRequest(context) {
  console.log('已执行')
  return new Response('{"code": 0, "data": {"id": 1}, "msg": "success"}')
}
