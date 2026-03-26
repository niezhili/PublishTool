import { useCallback, useState } from 'react'

interface EditorProps {
  /** 编辑器的文本内容 */
  value: string
  /** 文本变化时的回调函数 */
  onChange: (value: string) => void
  /** 占位符文本 */
  placeholder?: string
  /** 是否为只读模式 */
  readOnly?: boolean
  /** 是否禁用编辑 */
  disabled?: boolean
  /** 文件拖拽上传时的回调函数 */
  onFileDropped?: (content: string) => void
}

/**
 * Editor 组件
 * 基础的文本编辑器，支持双向绑定、拖拽上传和各种状态
 *
 * 使用示例：
 * <Editor
 *   value={text}
 *   onChange={setText}
 *   onFileDropped={setContent}
 *   placeholder="输入文本..."
 *   readOnly={false}
 * />
 */
export function Editor({
  value,
  onChange,
  placeholder = '输入文本...',
  readOnly = false,
  disabled = false,
  onFileDropped,
}: EditorProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const canDropFile = Boolean(onFileDropped) && !disabled && !readOnly

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
          console.log('[Editor] 文件上传成功，大小:', file.size, 'bytes')
          onFileDropped?.(content)
        } catch (error) {
          console.error('[Editor] 文件读取失败:', error)
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

      // 只有当有onFileDropped回调时才处理拖拽
      if (!onFileDropped) return

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileRead(files[0])
      }
    },
    [onFileDropped, handleFileRead]
  )

  return (
    <div
      onDragEnter={canDropFile ? handleDragEnter : undefined}
      onDragLeave={canDropFile ? handleDragLeave : undefined}
      onDragOver={canDropFile ? handleDragOver : undefined}
      onDrop={canDropFile ? handleDrop : undefined}
      className={`
        relative w-full h-full rounded-lg
        transition-all duration-200
        ${isDragActive && canDropFile ? 'bg-blue-50' : ''}
      `}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly || disabled}
        disabled={disabled}
        className={`
          absolute inset-0
          w-full h-full p-4
          font-mono text-sm
          border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          resize-none
          ${readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${disabled ? 'opacity-50' : ''}
          ${isDragActive && canDropFile ? 'border-blue-500' : ''}
        `}
      />

      {/* 拖拽提示覆盖层 */}
      {isDragActive && canDropFile && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-70 rounded-lg flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
            </svg>
            <p className="text-blue-700 font-medium">释放文件即可上传</p>
          </div>
        </div>
      )}
    </div>
  )
}
