import { useState } from 'react'
import { doubleAPI } from '@/services/doubleAPI'
import { TextPolishRequest, TextPolishResponse } from '@/types'

/**
 * 文本润色Hook
 * 用于在组件中调用文本润色API
 *
 * 使用示例：
 * const { polish, isLoading, error } = useTextPolish()
 * await polish({ content: '原文本', requirement: '要求' })
 */
export function useTextPolish() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 调用文本润色API
   * @param request - 包含content和requirement的对象
   * @returns 润色后的文本响应，失败时返回null
   */
  const polish = async (request: TextPolishRequest): Promise<TextPolishResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('[useTextPolish] 开始调用API')
      const result = await doubleAPI.polishText(request)
      console.log('[useTextPolish] 调用成功')
      return result
    } catch (err) {
      // 捕获错误并保存到状态
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      console.error('[useTextPolish] 调用失败:', errorMessage)
      setError(errorMessage)
      return null
    } finally {
      // 无论成功失败都停止loading
      setIsLoading(false)
    }
  }

  return { polish, isLoading, error }
}
