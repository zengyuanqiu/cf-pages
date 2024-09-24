const logs = []


export function onRequest(context) {
  const response = { code: 0, data: null }
  if (context.params.w) {
    logs.push({
      date: new Date().toLocaleString(),
      val: context.params.data
    })
  }
  if (context.params.r) {
    response.data = logs
  }
  return new Response(JSON.stringify(response))
}