/**
 * Vercel Serverless Function - 文本润色 API 代理
 * 解决前端直接调用外部 API 的跨域问题，同时将 API Key 保留在服务端
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiUrl = process.env.TEXT_POLISH_API_URL
  const apiKey = process.env.TEXT_POLISH_API_KEY

  if (!apiUrl || !apiKey) {
    console.error('[text-polish] 缺少服务端环境变量 TEXT_POLISH_API_URL / TEXT_POLISH_API_KEY')
    res.status(500).json({ error: 'Server configuration error' })
    return
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 55000) // 55s，留 5s 余量给 Vercel

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    })
    clearTimeout(timer)

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.error('[text-polish] upstream request timed out')
      res.status(504).json({ error: 'Upstream API timed out' })
    } else {
      console.error('[text-polish] proxy error:', error)
      res.status(500).json({ error: 'Failed to proxy API request', detail: String(error) })
    }
  }
}
