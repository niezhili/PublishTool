import axios, { AxiosInstance } from 'axios'
import { TextPolishRequest, TextPolishResponse, ImageGenerationRequest, ImageGenerationResponse } from '@/types'

/**
 * DoubleAPI 类
 * 负责与豆包AI API的所有交互
 * 这是一个示例实现，可根据实际API格式调整
 */
class DoubleAPI {
  private textClient: AxiosInstance
  private imageClient: AxiosInstance

  constructor() {
    // 文本润色API客户端（通过 /api/text-polish 同源代理，避免跨域）
    this.textClient = axios.create({
      baseURL: '/api/text-polish',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30秒超时
    })

    // 图片生成API客户端（通过 /api/image-gen 同源代理，避免跨域）
    this.imageClient = axios.create({
      baseURL: '/api/image-gen',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60秒超时（图片生成较慢）
    })
  }

  /**
   * 调用文本润色API
   * 基于豆包的chat completions API格式
   * @param request - 包含原始文本和润色要求
   * @returns 润色后的文本
   * @throws 如果API调用失败
   */
  async polishText(request: TextPolishRequest): Promise<TextPolishResponse> {
    try {
      console.log('[DoubleAPI] 调用文本润色API', { 
        contentLength: request.content.length,
        requirement: request.requirement 
      })

      // 构建豆包API格式的请求
      const messages = [
        {
          role: 'user',
          content: `请帮我润色以下文章内容。${request.requirement ? `要求：${request.requirement}。` : ''}原文：\n\n${request.content}`
        }
      ]

      const response = await this.textClient.post('', {
        model: import.meta.env.VITE_TEXT_MODEL_NAME,
        messages: messages,
        temperature: parseFloat(import.meta.env.VITE_TEMPERATURE) || 0.7,
        top_p: parseFloat(import.meta.env.VITE_TOP_P) || 0.9,
      })

      console.log('[DoubleAPI] 文本润色API返回', { 
        status: response.status,
        hasData: !!response.data 
      })

      // 处理豆包API的响应格式
      // 根据实际API返回格式调整
      let polishedContent = ''
      
      if (response.data?.choices?.[0]?.message?.content) {
        // 标准OpenAI/豆包格式
        polishedContent = response.data.choices[0].message.content
      } else if (response.data?.result) {
        // 其他可能的格式
        polishedContent = response.data.result
      } else if (typeof response.data === 'string') {
        polishedContent = response.data
      } else {
        console.error('[DoubleAPI] 无法识别的API响应格式:', response.data)
        throw new Error('API返回格式不正确，无法识别润色结果')
      }

      console.log('[DoubleAPI] 文本润色成功, 结果长度:', polishedContent.length)
      
      return {
        polishedContent,
        originalContent: request.content
      }
    } catch (error) {
      const errorMessage = this.handleError(error, '文本润色')
      throw new Error(errorMessage)
    }
  }

  /**
   * 调用图片生成API
   * 基于豆包的images generations API格式
   * @param request - 包含prompt、尺寸和数量
   * @returns 生成的图片URLs或Base64
   * @throws 如果API调用失败
   */
  async generateImages(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      console.log('[DoubleAPI] 调用图片生成API', { 
        prompt: request.prompt,
        size: `${request.width}x${request.height}`,
        count: request.count
      })

      // 将 count 传给服务端代理，由服务端统一并发请求，避免前端多次调用 Serverless 函数
      const response = await this.imageClient.post('', {
        model: request.model ?? import.meta.env.VITE_IMAGE_MODEL_NAME,
        prompt: request.prompt,
        size: `${request.width}x${request.height}`,
        n: request.count,
      })

      console.log('[DoubleAPI] 图片生成API返回', {
        status: response.status,
        hasData: !!response.data,
      })

      const images = this.extractImagesFromResponse(response.data)

      if (images.length === 0) {
        console.error('[DoubleAPI] 无法识别的图片API响应格式:', response.data)
        throw new Error('API返回格式不正确，无法识别图片')
      }

      if (images.length < request.count) {
        console.error('[DoubleAPI] 图片数量不足:', {
          expected: request.count,
          actual: images.length,
        })
        throw new Error(`图片生成失败：预期生成${request.count}张，实际仅返回${images.length}张`)
      }

      console.log('[DoubleAPI] 图片生成成功, 生成了', images.length, '张图片')
      
      return { images: images.slice(0, request.count) }
    } catch (error) {
      const errorMessage = this.handleError(error, '图片生成')
      throw new Error(errorMessage)
    }
  }

  private extractImagesFromResponse(data: unknown): string[] {
    let rawImages: unknown[] = []

    if (Array.isArray((data as { data?: unknown[] })?.data)) {
      rawImages = (data as { data: unknown[] }).data
    } else if (Array.isArray((data as { images?: unknown[] })?.images)) {
      rawImages = (data as { images: unknown[] }).images
    } else if (Array.isArray(data)) {
      rawImages = data
    }

    return rawImages
      .map((item) => {
        if (typeof item === 'string') {
          return this.normalizeImageSource(item)
        }

        if (item && typeof item === 'object') {
          const candidate = (item as { url?: string; b64_json?: string }).url ?? (item as { url?: string; b64_json?: string }).b64_json ?? ''
          return this.normalizeImageSource(candidate)
        }

        return ''
      })
      .filter(Boolean)
  }

  private normalizeImageSource(image: string): string {
    if (!image) {
      return ''
    }

    if (/^(https?:|data:|blob:)/i.test(image)) {
      return image
    }

    return `data:image/png;base64,${image}`
  }

  /**
   * 统一的错误处理函数
   * @param error - axios错误对象
   * @param operation - 操作名称（用于错误信息）
   * @returns 用户友好的错误消息
   */
  private handleError(error: unknown, operation: string): string {
    if (axios.isAxiosError(error)) {
      // API返回了错误状态码
      if (error.response) {
        const status = error.response.status
        // 兑容 { message }, { error: { message } }, { error: 'string' } 三种返回格式
        const data = error.response.data as any
        const message = data?.message || data?.error?.message || (typeof data?.error === 'string' ? data.error : null) || '请求失败'

        console.error(`[DoubleAPI] ${operation}失败 (${status}):`, {
          status,
          message,
          data: error.response.data
        })

        switch (status) {
          case 400:
            return `${operation}失败：请求参数有误。${message}`
          case 401:
            return `${operation}失败：API密钥无效或已过期，请检查.env中的配置`
          case 403:
            return `${operation}失败：无权限访问，请检查API密钥`
          case 404:
            return `${operation}失败：API端点不存在，请检查.env中的API_URL`
          case 429:
            return `${operation}失败：请求过于频繁，请稍候再试`
          case 500:
          case 502:
          case 503:
            return `${operation}失败：服务器错误，请稍候重试`
          default:
            return `${operation}失败 (${status})：${message}`
        }
      }
      // 网络错误或超时
      else if (error.request) {
        console.error(`[DoubleAPI] ${operation}网络错误:`, error.message)
        if (error.code === 'ECONNABORTED') {
          return `${operation}失败：请求超时，API响应过慢，请检查网络连接和API配置`
        }
        return `${operation}失败：网络连接错误，请检查网络和API地址是否可访问`
      }
    }

    // 其他未知错误
    const msg = error instanceof Error ? error.message : '未知错误'
    console.error(`[DoubleAPI] ${operation}异常:`, msg)
    return `${operation}失败：${msg}`
  }
}

/**
 * 全局API实例
 * 在整个应用中使用此实例调用API
 */
export const doubleAPI = new DoubleAPI()
