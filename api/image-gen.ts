/**
 * Vercel Serverless Function - 图片生成 API 代理
 * 解决前端直接调用外部 API 的跨域问题，同时将 API Key 保留在服务端
 * 支持 n > 1 时在服务端并发请求，避免前端多次调用 Serverless 函数
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

  const body = req.body ?? {}
  // 如果前端传入 n > 1，在服务端并发请求（每次 n=1），避免多次跨 Serverless 调用
  const count: number = typeof body.n === 'number' && body.n > 1 ? body.n : 1
  const singleBody = { ...body, n: 1 }

  const fetchOne = async () => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 55000) // 55s，留 5s 余量给 Vercel
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(singleBody),
        signal: controller.signal,
      })
      clearTimeout(timer)
      return { ok: true, status: response.status, data: await response.json() }
    } catch (err: any) {
      clearTimeout(timer)
      return { ok: false, status: 500, error: err?.name === 'AbortError' ? 'Upstream API timed out' : String(err) }
    }
  }

  try {
    const results = await Promise.all(Array.from({ length: count }, fetchOne))

    const failed = results.find((r) => !r.ok)
    if (failed && !failed.ok) {
      console.error('[image-gen] upstream error:', failed)
      res.status(failed.status).json({ error: failed.error })
      return
    }

    // 将所有结果的 data.data 数组合并后返回，格式与原始 API 一致
    const allImages = results.flatMap((r) => {
      if (r.ok && Array.isArray((r.data as any)?.data)) {
        return (r.data as any).data
      }
      return []
    })

    console.log('[image-gen] 生成完成, images:', allImages.length)
    res.status(200).json({ data: allImages })
  } catch (error: any) {
    console.error('[image-gen] proxy error:', error)
    res.status(500).json({ error: 'Failed to proxy API request', detail: String(error) })
  }
}

