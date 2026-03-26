import { Editor } from './Editor'

interface EditorCompareProps {
  /** 左侧(原文本)的值 */
  originalText: string
  /** 左侧文本变化时的回调 */
  onOriginalChange: (text: string) => void

  /** 右侧(润色结果)的值 */
  polishedText: string
  /** 右侧文本变化时的回调 */
  onPolishedChange: (text: string) => void

  /** 文件拖拽上传时的回调 */
  onFileDropped?: (content: string) => void

  /** 是否为加载中状态 */
  isLoading?: boolean
}

/**
 * EditorCompare 组件
 * 分屏对比编辑器，左边是原文，右边是润色结果
 * 左边支持拖拽上传.md文件和粘贴内容
 *
 * 使用示例：
 * <EditorCompare
 *   originalText={original}
 *   onOriginalChange={setOriginal}
 *   polishedText={polished}
 *   onPolishedChange={setPolished}
 *   onFileDropped={handleFileDrop}
 * />
 */
export function EditorCompare({
  originalText,
  onOriginalChange,
  polishedText,
  onPolishedChange,
  onFileDropped,
  isLoading = false,
}: EditorCompareProps) {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* 左侧：原文本编辑器（支持拖拽上传和粘贴） */}
      <div className="flex flex-col border rounded-lg overflow-hidden bg-white shadow">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-gray-800">初稿</h2>
          <p className="text-gray-500 text-xs mt-1">支持拖拽上传.md文件或直接粘贴</p>
        </div>

        <div className="p-4 flex-1 overflow-hidden">
          <Editor
            value={originalText}
            onChange={onOriginalChange}
            onFileDropped={onFileDropped}
            placeholder="输入或粘贴文本，也可以拖拽上传.md文件"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* 右侧：润色结果编辑器（可编辑） */}
      <div className="flex flex-col border rounded-lg overflow-hidden bg-white shadow">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-gray-800">润色结果</h2>
          <p className="text-gray-500 text-xs mt-1">可继续编辑</p>
        </div>

        <div className="p-4 flex-1 overflow-hidden">
          <Editor
            value={polishedText}
            onChange={onPolishedChange}
            placeholder="润色结果将显示在这里"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
