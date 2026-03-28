import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { useTextPolish } from '@/hooks/useTextPolish'
import { useImageGeneration } from '@/hooks/useImageGeneration'
import { Editor } from '@/components/Editor/Editor'
import { downloadImage } from '@/utils/fileDownload'

/**
 * PolishPage 组件
 * 文章润色的主功能页面
 * 2列布局：左列（初稿+润色要求+按钮）| 右列（润色结果+生成封面）
 */
export function PolishPage() {
  // 从Store获取状态和方法
  const { originalText, setOriginalText, polishedText, setPolishedText, polishingRequirement, setPolishingRequirement, generatedImages, setGeneratedImages, isLoading, setIsLoading, error, setError } = useAppStore()

  // 生成封面的prompt输入状态
  const [coverPrompt, setCoverPrompt] = useState('根据文章内容，生成192*128px的封面')

  // 使用Hook进行API调用
  const { polish, isLoading: hookIsLoading, error: hookError } = useTextPolish()
  const { generate, isLoading: imageIsLoading, error: imageError } = useImageGeneration()

  const handleDownloadImage = async (imageSource: string, index: number) => {
    try {
      setError(undefined)
      await downloadImage(imageSource, `cover-${index + 1}`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '图片下载失败'
      setError(errorMsg)
      console.error('[PolishPage] 图片下载异常:', errorMsg)
    }
  }

  // 处理润色按钮点击
  const handlePolish = async () => {
    // 验证输入
    if (!originalText.trim()) {
      setError('请输入要润色的文本')
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      const result = await polish({
        content: originalText,
        requirement: polishingRequirement,
      })

      if (result) {
        setPolishedText(result.polishedContent)
        console.log('[PolishPage] 润色成功')
      } else {
        // 如果返回null，说明Hook中已经设置了error
        setError(hookError || '润色失败，请检查API配置')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '未知错误'
      setError(errorMsg)
      console.error('[PolishPage] 润色异常:', errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // 处理生成封面按钮点击
  const handleGenerateCover = async () => {
    if (!polishedText.trim()) {
      setError('请先在第二个框中生成或输入润色结果，再生成封面')
      return
    }

    if (!coverPrompt.trim()) {
      setError('请输入图片描述')
      return
    }

    try {
      const coverGenerationPrompt = `${coverPrompt}\n\n文章内容：\n${polishedText}`

      // 从 prompt 中解析尺寸（如 "192*128px"、"192x128"、"1920×1080"），优先级高于默认值
      const sizeMatch = coverPrompt.match(/(\d+)\s*[*x×]\s*(\d+)\s*px?/i)
      const width = sizeMatch ? parseInt(sizeMatch[1], 10) : 192
      const height = sizeMatch ? parseInt(sizeMatch[2], 10) : 128

      const images = await generate(coverGenerationPrompt, width, height, 4)
      if (images && images.length > 0) {
        setGeneratedImages(images)
        console.log('[PolishPage] 图片生成成功，共', images.length, '张')
        setError(undefined)
      } else {
        setError(imageError || '生成图片失败，请检查API配置')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '未知错误'
      setError(errorMsg)
      console.error('[PolishPage] 图片生成异常:', errorMsg)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto w-full px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">PublishTool</h1>
          <p className="text-gray-600 text-sm mt-1">文章润色与封面生成工具</p>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex flex-col">
        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* 3列布局：左列（初稿+控制）| 中列（润色结果）| 右列（生成封面） */}
        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
          {/* 左列：初稿框 + 润色要求 + 按钮 */}
          <div className="flex flex-col">
            {/* 初稿编辑框 */}
            <div className="flex flex-col border rounded-lg overflow-hidden bg-white shadow mb-4 flex-1 min-h-0">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h2 className="text-lg font-bold text-gray-800">初稿</h2>
                <p className="text-gray-500 text-xs mt-1">支持拖拽上传.md文件或直接粘贴</p>
              </div>
              <div className="p-4 flex-1 overflow-hidden">
                <Editor
                  value={originalText}
                  onChange={setOriginalText}
                  onFileDropped={setOriginalText}
                  placeholder="输入或粘贴文本，也可以拖拽上传.md文件"
                  disabled={isLoading || hookIsLoading}
                />
              </div>
            </div>

            {/* 润色要求和按钮并排 */}
            <div className="bg-white rounded-lg shadow p-4 flex gap-3 items-end">
              {/* 润色要求输入框 */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  润色要求
                </label>
                <input
                  type="text"
                  value={polishingRequirement}
                  onChange={(e) => setPolishingRequirement(e.target.value)}
                  placeholder="例如：使用专业语言、增加学术性、简化表述..."
                  disabled={isLoading || hookIsLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* 润色按钮 */}
              <button
                onClick={handlePolish}
                disabled={!originalText.trim() || !polishingRequirement.trim() || isLoading || hookIsLoading}
                className={`
                  px-4 py-2 rounded-lg font-medium text-white whitespace-nowrap
                  transition-all duration-200
                  ${
                    !originalText.trim() || !polishingRequirement.trim() || isLoading || hookIsLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }
                `}
              >
                {isLoading || hookIsLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  '润色'
                )}
              </button>
            </div>
          </div>

          {/* 中列：润色结果框 */}
          <div className="flex flex-col">
            {/* 润色结果编辑框 */}
            <div className="flex flex-col border rounded-lg overflow-hidden bg-white shadow mb-4 flex-1 min-h-0">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h2 className="text-lg font-bold text-gray-800">润色结果</h2>
                  <p className="text-gray-500 text-xs mt-1">支持拖拽上传.md文件或直接编辑</p>
              </div>
              <div className="p-4 flex-1 overflow-hidden">
                <Editor
                  value={polishedText}
                  onChange={setPolishedText}
                    onFileDropped={setPolishedText}
                  placeholder="润色结果将显示在这里"
                  disabled={isLoading || hookIsLoading}
                />
              </div>
            </div>

            {/* 生成封面的prompt输入和按钮 - 与左列样式一致 */}
            <div className="bg-white rounded-lg shadow p-4 flex gap-3 items-end">
              {/* 图片描述输入框 */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图片描述
                </label>
                <input
                  type="text"
                  value={coverPrompt}
                  onChange={(e) => setCoverPrompt(e.target.value)}
                  placeholder="例如：根据文章内容，生成192*128px的封面"
                  disabled={imageIsLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* 生成按钮 */}
              <button
                onClick={handleGenerateCover}
                disabled={!polishedText.trim() || !coverPrompt.trim() || imageIsLoading}
                className={`
                  px-4 py-2 rounded-lg font-medium text-white whitespace-nowrap
                  transition-all duration-200
                  ${
                    !polishedText.trim() || !coverPrompt.trim() || imageIsLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 active:scale-95'
                  }
                `}
              >
                {imageIsLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  '生成封面'
                )}
              </button>
            </div>
          </div>

          {/* 右列：生成封面框 */}
          <div className="flex flex-col border rounded-lg overflow-hidden bg-white shadow">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h2 className="text-lg font-bold text-gray-800">生成封面</h2>
              <p className="text-gray-500 text-xs mt-1">一次生成4张图片</p>
            </div>

            <div className="p-4 flex flex-col gap-3 overflow-hidden flex-1">

              {/* 图片预览 */}
              {generatedImages.length > 0 && (
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-3">
                    {generatedImages.map((img, idx) => (
                      <div key={idx} className="border rounded overflow-hidden bg-gray-50 flex flex-col">
                        <div className="bg-white p-2">
                          <img
                            src={img}
                            alt={`生成的封面 ${idx + 1}`}
                            className="w-full aspect-[3/2] object-contain rounded"
                          />
                        </div>
                        <button
                          className="shrink-0 border-t border-gray-200 bg-blue-500 px-2 py-2 text-xs text-white transition-colors hover:bg-blue-600"
                          onClick={() => void handleDownloadImage(img, idx)}
                        >
                          下载
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 空状态提示 */}
              {generatedImages.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  生成后显示图片预览
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
