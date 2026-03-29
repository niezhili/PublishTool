/**
 * Vercel Serverless Function - 健康检查
 * 访问 /api/health 验证 Serverless Functions 是否正常部署及环境变量是否配置
 */
export default async function handler(req: any, res: any) {
  res.status(200).json({
    ok: true,
    env: {
      TEXT_POLISH_API_URL: !!process.env.TEXT_POLISH_API_URL,
      TEXT_POLISH_API_KEY: !!process.env.TEXT_POLISH_API_KEY,
      IMAGE_GEN_API_URL: !!process.env.IMAGE_GEN_API_URL,
      IMAGE_GEN_API_KEY: !!process.env.IMAGE_GEN_API_KEY,
    },
  })
}
