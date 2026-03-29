/**
 * Vercel Serverless Function - 图片生成 API 代理
 * 解决前端直接调用外部 API 的跨域问题，同时将 API Key 保留在服务端
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiUrl = process.env.IMAGE_GEN_API_URL
  const apiKey = process.env.IMAGE_GEN_API_KEY

  if (!apiUrl || !apiKey) {
    console.error('[image-gen] 缺少服务端环境变量 IMAGE_GEN_API_URL / IMAGE_GEN_API_KEY')
    res.status(500).json({ error: 'Server configuration error' })
    return
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    console.error('[image-gen] proxy error:', error)
    res.status(500).json({ error: 'Failed to proxy API request' })
  }
}
