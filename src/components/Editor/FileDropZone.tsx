import { useCallback, useState, useRef } from 'react'

interface FileDropZoneProps {
  /** 文件上传成功时的回调 */
  onFileDropped: (content: string) => void
}

/**
 * FileDropZone 组件
 * 支持拖拽上传和点击上传 .md 文件
 *
 * 使用示例：
 * <FileDropZone onFileDropped={(content) => setContent(content)} />
 */
export function FileDropZone({ onFileDropped }: FileDropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * 处理文件读取
   */
  const handleFileRead = useCallback(
    (file: File) => {
      // 验证文件类型
      if (!file.name.endsWith('.md')) {
        alert('请上传 .md 文件')
        return
      }

      // 验证文件大小（限制10MB）
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert('文件过大，请选择小于10MB的文件')
        return
      }

      // 读取文件内容
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          console.log('[FileDropZone] 文件上传成功，大小:', file.size, 'bytes')
          onFileDropped(content)
        } catch (error) {
          console.error('[FileDropZone] 文件读取失败:', error)
          alert('文件读取失败，请重试')
        }
      }
      reader.onerror = () => {
        alert('文件读取失败，请重试')
      }
      reader.readAsText(file)
    },
    [onFileDropped]
  )

  /**
   * 处理拖拽进入
   */
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  /**
   * 处理拖拽离开
   */
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  /**
   * 处理拖拽结束
   */
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  /**
   * 处理文件放下
   */
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileRead(files[0])
      }
    },
    [handleFileRead]
  )

  /**
   * 处理点击选择文件
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files
      if (files && files.length > 0) {
        handleFileRead(files[0])
      }
    },
    [handleFileRead]
  )

  const handleClickInput = () => {
    inputRef.current?.click()
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClickInput}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-all duration-200
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
      `}
    >
      <div className="pointer-events-none">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-3.172-3.172a2 2 0 00-2.828 0L28 8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-gray-600 font-medium">拖拽 .md 文件到这里</p>
        <p className="text-gray-500 text-sm mt-1">或点击选择文件</p>
        <p className="text-gray-400 text-xs mt-2">支持最大 10MB 的文件</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".md"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}
