const logs = []

export function onRequest(context) {
  const response = { code: 0, data: null }
  const url = new URL(context.request.url)
  const query = url.searchParams
  if (query.get('w')) {
    logs.push({
      date: Date.now(),
      val: query.get('data')
    })
  }
  if (query.get('r')) {
    response.data = [...logs]
    logs.length = 0
  }
  return new Response(JSON.stringify(response))
}