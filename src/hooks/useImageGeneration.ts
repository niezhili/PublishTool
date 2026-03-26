import { useState } from 'react'
import { doubleAPI } from '@/services/doubleAPI'

/**
 * 图片生成Hook
 * 用于在组件中调用图片生成API
 *
 * 使用示例：
 * const { generate, isLoading, error } = useImageGeneration()
 * const images = await generate('192*128px 封面', 192, 128, 4)
 */
export function useImageGeneration() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 生成图片
   * @param prompt - 图片描述文本
   * @param width - 图片宽度，默认192px
   * @param height - 图片高度，默认128px
   * @param count - 生成数量，默认4张
   * @returns 生成的图片列表，失败时返回null
   */
  const generate = async (
    prompt: string,
    width: number = 1920,
    height: number = 1920,
    count: number = 4
  ): Promise<string[] | null> => {
    setIsLoading(true)
    setError(null)

    // 验证prompt不为空
    if (!prompt.trim()) {
      setError('请输入图片描述')
      setIsLoading(false)
      return null
    }

    try {
      console.log('[useImageGeneration] 开始调用API', { prompt, width, height, count })
      const result = await doubleAPI.generateImages({
        prompt,
        width,
        height,
        count,
      })
      console.log('[useImageGeneration] 调用成功，生成了', result.images.length, '张图片')
      return result.images
    } catch (err) {
      // 捕获错误并保存到状态
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      console.error('[useImageGeneration] 调用失败:', errorMessage)
      setError(errorMessage)
      return null
    } finally {
      // 无论成功失败都停止loading
      setIsLoading(false)
    }
  }

  return { generate, isLoading, error }
}
