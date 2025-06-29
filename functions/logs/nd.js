const LOG_KEY = 'ND_LOGS'
const TD_WIP = 'TD_WIP'

export async function onRequest(context) {
  const { env } = context
  const response = { code: 0, data: null }
  const url = new URL(context.request.url)
  const query = url.searchParams
  if (query.get('d')) {
    await env.LOG.delete(LOG_KEY)
  }
  const w = query.get('w')
  const r = query.get('r')
  if (w || r) {
    const logs = await env.LOG.get(LOG_KEY, 'json') || []
    if (w) {
      logs.push({
        date: Date.now(),
        val: query.get('data')
      })
      await env.LOG.put(LOG_KEY, JSON.stringify(logs))
      response.data = true
    }
    if (r) {
      response.data = logs
    }
  } else if (query.get('wip')) {
    await env.LOG.put(TD_WIP, query.get('data'))
    response.data = true
  } else if (query.get('rip')) {
    const ip = await env.LOG.get(TD_WIP)
    response.data = ip
  }
  return new Response(JSON.stringify(response), {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
}