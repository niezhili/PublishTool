import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  // 加载全部环境变量（包含非 VITE_ 前缀），用于本地开发代理注入 API Key
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        // 本地开发时将 /api/text-polish 代理到豆包 Chat API
        '/api/text-polish': {
          target: 'https://ark.cn-beijing.volces.com',
          changeOrigin: true,
          rewrite: () => '/api/v3/chat/completions',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.TEXT_POLISH_API_KEY}`)
            })
          },
        },
        // 本地开发时将 /api/image-gen 代理到豆包 Images API
        '/api/image-gen': {
          target: 'https://ark.cn-beijing.volces.com',
          changeOrigin: true,
          rewrite: () => '/api/v3/images/generations',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.IMAGE_GEN_API_KEY}`)
            })
          },
        },
      },
    },
  }
})
