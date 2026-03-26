# 📋 PublishTool 开发计划文档

**项目名称**：文章润色与封面生成工具  
**开发阶段**：项目启动  
**最后更新**：2026-03-23  

---

## 目录

1. [项目概览](#项目概览)
2. [技术架构](#技术架构)
3. [开发阶段划分](#开发阶段划分)
4. [详细开发步骤](#详细开发步骤)
5. [时间估计](#时间估计)
6. [风险评估](#风险评估)
7. [质保计划](#质保计划)

---

## 项目概览

### 产品目标
构建一个Web应用，帮助用户完整完成**文章润色 → 生成封面**的工作流，使用豆包AI模型实现智能润色和图片生成。

### 核心特性
- ✅ 初稿输入（粘贴/拖拽上传md文件）
- ✅ AI文本润色（分屏对比、双向编辑）
- ✅ AI生成封面（4张图片、实时预览）
- ✅ 灵活导出（另存为、自定义文件名）
- ✅ 无本地存储（直接下载、完全清空）

### 用户类型
- 主要用户：个人 + 少数朋友
- 使用频率：每天频繁使用
- 技术特性：API密钥自己配置

---

## 技术架构

### 前端技术栈
| 层级 | 技术选型 | 版本 | 说明 |
|------|---------|------|------|
| 框架 | React | 18.x | 核心前端框架 |
| 语言 | TypeScript | 5.x | 类型安全 |
| 构建 | Vite | 5.x | 闪电般的开发体验 |
| 样式 | Tailwind CSS | 3.x | 实用优先CSS框架 |
| 组件库 | shadcn/ui | 最新 | 优雅的UI组件 |
| 状态管理 | Zustand | 4.x | 轻量级状态管理 |
| HTTP | axios | 1.x | API请求库 |
| 文本处理 | remark | 最新 | Markdown处理 |
| 文件保存 | file-saver | 2.x | 浏览器文件下载 |

### 项目结构
```
publish-tool/
├── src/
│   ├── components/          # React组件
│   │   ├── Editor/         # 编辑器组件
│   │   │   ├── FileDropZone.tsx    # 拖拽上传
│   │   │   ├── Editor.tsx          # 文本编辑器
│   │   │   └── EditorCompare.tsx   # 分屏对比
│   │   ├── ImageGallery/   # 图片库
│   │   │   ├── ImageGallery.tsx    # 图片列表
│   │   │   ├── ImageCard.tsx       # 单张图片卡片
│   │   │   └── ImagePreview.tsx    # 图片预览
│   │   ├── PromptEditor/   # Prompt编辑
│   │   │   ├── PromptInput.tsx     # Prompt输入框
│   │   │   └── ImageSizeDisplay.tsx # 尺寸显示
│   │   ├── Toolbar/        # 工具栏
│   │   │   ├── Toolbar.tsx
│   │   │   ├── ExportModal.tsx     # 另存为
│   │   │   └── ExportButton.tsx
│   │   └── Common/         # 通用组件
│   │       ├── Loading.tsx         # 加载动画
│   │       ├── Toast.tsx           # 消息提示
│   │       └── Button.tsx
│   ├── pages/              # 页面
│   │   └── App.tsx
│   ├── services/           # 服务层
│   │   └── doubleAPI.ts    # 豆包API封装
│   ├── store/              # 状态管理
│   │   ├── appStore.ts     # 全局应用状态
│   │   └── uiStore.ts      # UI状态（toast等）
│   ├── hooks/              # 自定义Hooks
│   │   ├── useDoubleAPI.ts
│   │   └── useFileDrop.ts
│   ├── types/              # 类型定义
│   │   └── index.ts
│   ├── utils/              # 工具函数
│   │   ├── md.ts           # markdown处理
│   │   ├── api.ts          # API辅助
│   │   ├── fileDownload.ts # 文件下载
│   │   └── validators.ts   # 数据验证
│   ├── styles/             # 全局样式
│   │   └── globals.css
│   └── main.tsx
├── public/                 # 静态资源
├── .env.example           # 环境变量示例
├── .env                   # 环境变量（gitignore）
├── .gitignore            # git忽略配置
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── PRD.md                # 产品需求文档
└── DEVELOPMENT_PLAN.md   # 本文件
```

---

## 开发阶段划分

### 阶段1：项目初始化（Day 1）
**目标**：搭建项目骨架和开发环境  
**产出物**：可运行的空白项目

### 阶段2：基础功能开发（Day 2-4）
**目标**：完成P1优先级所有功能  
**产出物**：可支持输入→润色→对比的完整流程

### 阶段3：高级功能开发（Day 5-6）
**目标**：完成P2优先级功能  
**产出物**：可支持生成封面→下载的完整工作流

### 阶段4：UI优化与测试（Day 7-8）
**目标**：P3优化、错误处理、完整测试  
**产出物**：可交付的完整应用

### 阶段5：优化与部署（Day 9）
**目标**：性能优化、部署、文档完善  
**产出物**：生产就绪的应用

---

## 详细开发步骤

### 阶段1：项目初始化（1天）

#### Step 1.1：初始化Vite项目
```bash
# 在d:\ProjectCode\PublishTool目录下运行
cd d:\ProjectCode\PublishTool

# 删除PRD.md和DEVELOPMENT_PLAN.md（暂存到其他位置）
# 然后初始化项目
npm create vite@latest . -- --template react-ts

# 或者手动创建
npm init -y
npm install vite @vitejs/plugin-react react react-dom typescript
```

**交付物**：
- [ ] package.json 创建完成
- [ ] node_modules 安装完成
- [ ] src/main.tsx 创建
- [ ] vite.config.ts 创建

---

#### Step 1.2：安装核心依赖
```bash
# 安装UI和样式库
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 安装shadcn/ui
npm install class-variance-authority clsx tailwind-merge

# 安装状态管理
npm install zustand

# 安装HTTP客户端
npm install axios

# 安装文件处理
npm install file-saver
npm install -D @types/file-saver

# 安装markdown处理
npm install remark remark-react remark-gfm

# 开发依赖
npm install -D @types/react @types/react-dom
```

**交付物**：
- [ ] package.json 更新（所有依赖已列出）
- [ ] tailwind.config.ts 配置完成
- [ ] postcss.config.js 配置完成

---

#### Step 1.3：配置TypeScript和项目结构
```bash
# 编辑 tsconfig.json
# 编辑 vite.config.ts
# 编辑 tailwind.config.ts
```

**关键配置**：
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

**交付物**：
- [ ] vite.config.ts 配置完成
- [ ] tsconfig.json 配置完成
- [ ] src/ 目录结构创建

---

#### Step 1.4：创建项目目录结构
```bash
# 手动创建以下目录
src/
  ├── components/
  │   ├── Editor/
  │   ├── ImageGallery/
  │   ├── PromptEditor/
  │   ├── Toolbar/
  │   └── Common/
  ├── pages/
  ├── services/
  ├── store/
  ├── hooks/
  ├── types/
  ├── utils/
  └── styles/
```

**交付物**：
- [ ] 所有目录创建完成
- [ ] 创建每个目录下的 .gitkeep 文件

---

#### Step 1.5：配置.env和全局样式
```bash
# 创建 .env 文件
VITE_TEXT_POLISH_API_URL=https://your-api-endpoint/v1/text/polish
VITE_TEXT_POLISH_API_KEY=your_api_key
VITE_IMAGE_GEN_API_URL=https://your-api-endpoint/v1/images/generate
VITE_IMAGE_GEN_API_KEY=your_image_api_key
VITE_TEXT_MODEL_NAME=doubao-pro
VITE_IMAGE_MODEL_NAME=doubao-image-gen
VITE_TEMPERATURE=0.7
VITE_TOP_P=0.9

# 创建 .env.example
# 创建 .gitignore
.env
node_modules/
dist/
.DS_Store

# 创建 src/styles/globals.css
```

**交付物**：
- [ ] .env 文件创建
- [ ] .env.example 文件创建
- [ ] .gitignore 配置完成
- [ ] src/styles/globals.css 创建并配置Tailwind

---

#### Step 1.6：创建基础类型定义
```typescript
// src/types/index.ts
export interface TextPolishRequest {
  content: string;
  requirement?: string;
}

export interface TextPolishResponse {
  polishedContent: string;
  originalContent: string;
}

export interface ImageGenerationRequest {
  prompt: string;
  width: number;
  height: number;
  count: number;
}

export interface ImageGenerationResponse {
  images: string[]; // base64 or URLs
}

export interface AppState {
  originalText: string;
  polishedText: string;
  polishingRequirement: string;
  generatedImages: string[];
  isLoading: boolean;
  error?: string;
}
```

**交付物**：
- [ ] src/types/index.ts 创建完成

---

#### Step 1.7：初始化App和测试运行
```typescript
// src/App.tsx - 空白模板
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">PublishTool</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* 内容区域 */}
      </main>
    </div>
  )
}
```

```bash
# 测试运行
npm run dev

# 打开 http://localhost:3000
```

**交付物**：
- [ ] src/App.tsx 创建
- [ ] src/main.tsx 配置完成
- [ ] npm run dev 可以成功运行

---

### 阶段2：基础功能开发（3天）

#### Step 2.1：创建状态管理Store
```typescript
// src/store/appStore.ts
import { create } from 'zustand'
import { AppState } from '@/types'

interface AppStateStore extends AppState {
  setOriginalText: (text: string) => void
  setPolishedText: (text: string) => void
  setPolishingRequirement: (requirement: string) => void
  setGeneratedImages: (images: string[]) => void
  setIsLoading: (loading: boolean) => void
  setError: (error?: string) => void
  reset: () => void
}

const initialState: AppState = {
  originalText: '',
  polishedText: '',
  polishingRequirement: '',
  generatedImages: [],
  isLoading: false,
  error: undefined,
}

export const useAppStore = create<AppStateStore>((set) => ({
  ...initialState,
  setOriginalText: (text) => set({ originalText: text }),
  setPolishedText: (text) => set({ polishedText: text }),
  setPolishingRequirement: (requirement) => set({ polishingRequirement: requirement }),
  setGeneratedImages: (images) => set({ generatedImages: images }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}))
```

**交付物**：
- [ ] src/store/appStore.ts 创建完成
- [ ] 单元测试通过

---

#### Step 2.2：API服务层封装
```typescript
// src/services/doubleAPI.ts
import axios, { AxiosInstance } from 'axios'
import { TextPolishRequest, TextPolishResponse, ImageGenerationRequest, ImageGenerationResponse } from '@/types'

class DoubleAPI {
  private textClient: AxiosInstance
  private imageClient: AxiosInstance

  constructor() {
    this.textClient = axios.create({
      baseURL: import.meta.env.VITE_TEXT_POLISH_API_URL,
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TEXT_POLISH_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    this.imageClient = axios.create({
      baseURL: import.meta.env.VITE_IMAGE_GEN_API_URL,
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_IMAGE_GEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })
  }

  async polishText(request: TextPolishRequest): Promise<TextPolishResponse> {
    try {
      const response = await this.textClient.post('/polish', {
        content: request.content,
        requirement: request.requirement,
        model: import.meta.env.VITE_TEXT_MODEL_NAME,
        temperature: parseFloat(import.meta.env.VITE_TEMPERATURE),
        top_p: parseFloat(import.meta.env.VITE_TOP_P),
      })
      return response.data
    } catch (error) {
      throw new Error(`文本润色失败: ${error.message}`)
    }
  }

  async generateImages(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    try {
      const response = await this.imageClient.post('/generate', {
        prompt: request.prompt,
        width: request.width,
        height: request.height,
        count: request.count,
        model: import.meta.env.VITE_IMAGE_MODEL_NAME,
      })
      return response.data
    } catch (error) {
      throw new Error(`图片生成失败: ${error.message}`)
    }
  }
}

export const doubleAPI = new DoubleAPI()
```

**交付物**：
- [ ] src/services/doubleAPI.ts 创建完成
- [ ] API错误处理完善
- [ ] 支持环境变量配置

---

#### Step 2.3：创建自定义Hook
```typescript
// src/hooks/useDoubleAPI.ts
import { useState } from 'react'
import { doubleAPI } from '@/services/doubleAPI'
import { TextPolishRequest, TextPolishResponse } from '@/types'

export function useTextPolish() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const polish = async (request: TextPolishRequest): Promise<TextPolishResponse | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await doubleAPI.polishText(request)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { polish, isLoading, error }
}

// src/hooks/useImageGeneration.ts
export function useImageGeneration() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (prompt: string, width: number = 192, height: number = 128, count: number = 4) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await doubleAPI.generateImages({ prompt, width, height, count })
      return result.images
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { generate, isLoading, error }
}
```

**交付物**：
- [ ] src/hooks/useDoubleAPI.ts 创建完成
- [ ] src/hooks/useImageGeneration.ts 创建完成
- [ ] Hook进行单元测试

---

#### Step 2.4：创建Editor编辑器组件
```typescript
// src/components/Editor/Editor.tsx
import { useState, useCallback } from 'react'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
}

export function Editor({ value, onChange, placeholder, readOnly }: EditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className="w-full h-full p-4 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    />
  )
}

// src/components/Editor/EditorCompare.tsx - 分屏对比编辑器
export function EditorCompare() {
  // 实现分屏对比逻辑
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* 左侧：初稿 */}
      {/* 右侧：润色结果 */}
    </div>
  )
}
```

**交付物**：
- [ ] src/components/Editor/Editor.tsx 创建完成
- [ ] src/components/Editor/EditorCompare.tsx 创建完成
- [ ] 支持markdown语法高亮（可选：prismjs）

---

#### Step 2.5：创建文件拖拽上传组件
```typescript
// src/components/Editor/FileDropZone.tsx
import { useCallback } from 'react'

interface FileDropZoneProps {
  onFileDropped: (content: string) => void
}

export function FileDropZone({ onFileDropped }: FileDropZoneProps) {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.name.endsWith('.md')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          onFileDropped(content)
        }
        reader.readAsText(file)
      } else {
        alert('请上传 .md 文件')
      }
    }
  }, [onFileDropped])

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500"
    >
      <p className="text-gray-600">拖拽 .md 文件到这里，或点击选择文件</p>
    </div>
  )
}
```

**交付物**：
- [ ] src/components/Editor/FileDropZone.tsx 创建完成
- [ ] 支持文件选择对话框

---

#### Step 2.6：创建主功能页面
```typescript
// src/pages/App.tsx - 润色页面
import { useAppStore } from '@/store/appStore'
import { useTextPolish } from '@/hooks/useDoubleAPI'
import { Editor } from '@/components/Editor/Editor'
import { FileDropZone } from '@/components/Editor/FileDropZone'

export default function AppPage() {
  const { originalText, setOriginalText, polishedText, setPolishedText, polishingRequirement, setPolishingRequirement } = useAppStore()
  const { polish, isLoading } = useTextPolish()

  const handlePolish = async () => {
    const result = await polish({
      content: originalText,
      requirement: polishingRequirement,
    })
    if (result) {
      setPolishedText(result.polishedContent)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {/* 左侧：初稿输入 */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">初稿</h2>
        <FileDropZone onFileDropped={setOriginalText} />
        <Editor value={originalText} onChange={setOriginalText} placeholder="粘贴或拖拽上传.md文件" />
        
        {/* 润色要求 */}
        <input
          type="text"
          value={polishingRequirement}
          onChange={(e) => setPolishingRequirement(e.target.value)}
          placeholder="输入润色要求（可选）"
          className="w-full mt-4 p-2 border rounded"
        />
        
        <button
          onClick={handlePolish}
          disabled={!originalText || isLoading}
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? '润色中...' : '润色'}
        </button>
      </div>

      {/* 右侧：润色结果 */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">润色结果</h2>
        <Editor value={polishedText} onChange={setPolishedText} placeholder="润色结果将显示在这里" />
      </div>
    </div>
  )
}
```

**交付物**：
- [ ] 润色功能完整可用
- [ ] 分屏编辑器可正常显示
- [ ] 可成功调用API（需要配置.env）

---

#### Step 2.7：完整测试和调试
```bash
# 本地测试
npm run dev

# 测试场景
1. 输入初稿，点击润色
2. 验证API调用
3. 验证结果显示
4. 测试拖拽上传
5. 测试双向编辑
```

**交付物**：
- [ ] P1功能全部标记为✓完成
- [ ] 没有console.error
- [ ] 响应式设计基本完成

---

### 阶段3：高级功能开发（2天）

#### Step 3.1：创建生成封面页面
```typescript
// src/pages/CoverGenerator.tsx
import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { useImageGeneration } from '@/hooks/useImageGeneration'

export function CoverGenerator() {
  const { polishedText } = useAppStore()
  const [prompt, setPrompt] = useState('192*128px')
  const [images, setImages] = useState<string[]>([])
  const { generate, isLoading } = useImageGeneration()

  const handleGenerate = async () => {
    const result = await generate(prompt, 192, 128, 4)
    if (result) {
      setImages(result)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* 左侧：Prompt编辑框 */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">生成封面</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-48 p-3 border rounded font-mono text-sm"
        />
        <button
          onClick={handleGenerate}
          disabled={!prompt || isLoading}
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? '生成中...' : '生成'}
        </button>
      </div>

      {/* 右侧：图片预览 */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">预览（4张图片）</h2>
        <div className="grid grid-cols-2 gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="border rounded p-2">
              <img src={img} alt={`Cover ${idx + 1}`} className="w-full h-auto" />
              <button className="w-full mt-2 text-sm bg-green-500 text-white p-1 rounded">
                下载
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**交付物**：
- [ ] CoverGenerator页面创建完成
- [ ] 可成功生成4张图片
- [ ] 图片实时预览

---

#### Step 3.2：创建图片下载功能
```typescript
// src/utils/fileDownload.ts
import { saveAs } from 'file-saver'

export function downloadFile(content: string | Blob, filename: string) {
  if (typeof content === 'string') {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    saveAs(blob, filename)
  } else {
    saveAs(content, filename)
  }
}

export async function downloadImage(imageUrl: string, filename: string) {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    saveAs(blob, filename)
  } catch (error) {
    console.error('图片下载失败:', error)
  }
}

// src/components/ImageGallery/ImageCard.tsx
export function ImageCard({ imageUrl, index, onDownload }: Props) {
  return (
    <div className="border rounded p-2">
      <img src={imageUrl} alt={`Cover ${index}`} className="w-full h-auto" />
      <button
        onClick={() => onDownload(imageUrl, `cover-${index}.png`)}
        className="w-full mt-2 bg-green-500 text-white p-1 rounded text-sm"
      >
        下载
      </button>
    </div>
  )
}
```

**交付物**：
- [ ] downloadFile函数完成
- [ ] 图片下载功能完成
- [ ] 支持自定义文件名

---

#### Step 3.3：创建另存为功能
```typescript
// src/components/Toolbar/ExportModal.tsx
import { useState } from 'react'
import { downloadFile } from '@/utils/fileDownload'

export function ExportModal({ content, onClose }: Props) {
  const [filename, setFilename] = useState('article.md')

  const handleExport = () => {
    downloadFile(content, filename)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-bold mb-4">另存为</h3>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            保存
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 p-2 rounded hover:bg-gray-400"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
```

**交付物**：
- [ ] 另存为对话框创建完成
- [ ] 支持自定义文件名
- [ ] 支持导出markdown

---

#### Step 3.4：页面路由和导航
```typescript
// src/App.tsx - 主入口
import { useState } from 'react'
import AppPage from '@/pages/App'
import { CoverGenerator } from '@/pages/CoverGenerator'

export default function App() {
  const [currentPage, setCurrentPage] = useState<'polish' | 'cover'>('polish')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">PublishTool</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('polish')}
              className={`px-4 py-2 rounded ${currentPage === 'polish' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              润色
            </button>
            <button
              onClick={() => setCurrentPage('cover')}
              className={`px-4 py-2 rounded ${currentPage === 'cover' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              生成封面
            </button>
          </div>
        </div>
      </header>

      {/* 内容区域 */}
      <main>
        {currentPage === 'polish' && <AppPage />}
        {currentPage === 'cover' && <CoverGenerator />}
      </main>
    </div>
  )
}
```

**交付物**：
- [ ] 页面导航完成
- [ ] 所有功能集成到一个App中
- [ ] P2所有功能标记为✓完成

---

### 阶段4：UI优化与测试（2天）

#### Step 4.1：UI美观优化
- [ ] 使用shadcn/ui组件替换原生按钮和输入框
- [ ] 完善色彩方案和字体
- [ ] 响应式设计优化
- [ ] 加载动画和过渡效果

#### Step 4.2：错误处理优化
```typescript
// src/components/Common/Toast.tsx - 消息提示
// src/store/uiStore.ts - UI状态管理
// 完善所有API调用的错误处理
```

**关键场景**：
- [ ] API调用失败时显示友好错误提示
- [ ] 网络超时处理
- [ ] 文件上传验证
- [ ] 输入框前端验证

#### Step 4.3：性能优化
- [ ] 代码分割（路由级别）
- [ ] 图片懒加载
- [ ] 防抖/节流处理
- [ ] 大文件处理优化

#### Step 4.4：完整测试
```bash
# 单元测试
npm run test

# E2E测试（手工）
1. 完从头到尾的工作流
2. 测试所有边界情况
3. 测试错误场景
4. 浏览器兼容性测试（Chrome、Firefox、Safari）
5. 移动端响应式测试
```

**交付物**：
- [ ] 所有P3功能完成
- [ ] 测试报告
- [ ] 无critical level的bug

---

### 阶段5：优化与部署（1天）

#### Step 5.1：生产构建
```bash
npm run build
npm run preview
```

#### Step 5.2：性能分析
```bash
# 使用Lighthouse进行性能审查
# 目标：Performance > 90, Accessibility > 90
```

#### Step 5.3：部署
```bash
# 部署到Vercel（推荐）
# 或部署到自己的服务器
```

#### Step 5.4：文档完善
- [ ] README.md - 快速开始指南
- [ ] API.md - API调用文档
- [ ] SETUP.md - 开发环境配置
- [ ] TROUBLESHOOTING.md - 常见问题

---

## 时间估计

| 阶段 | 任务 | 小时 | 总计 |
|------|------|------|------|
| **阶段1** | 项目初始化 | 2 | 2h |
| **阶段2** | Store创建 | 1 | 3h |
| | API服务层 | 2 | 5h |
| | Hook创建 | 1.5 | 6.5h |
| | Editor组件 | 1.5 | 8h |
| | 拖拽上传 | 1 | 9h |
| | 主功能页面 | 2 | 11h |
| | 测试调试 | 1.5 | 12.5h |
| **阶段3** | 生成封面页面 | 2 | 14.5h |
| | 图片下载 | 1.5 | 16h |
| | 另存为功能 | 1 | 17h |
| | 路由导航 | 1 | 18h |
| **阶段4** | UI优化 | 3 | 21h |
| | 错误处理 | 1.5 | 22.5h |
| | 性能优化 | 1.5 | 24h |
| | 完整测试 | 2 | 26h |
| **阶段5** | 优化部署 | 2 | 28h |

**总计估计**：28小时（约3-4个工作日的紧张开发）

---

## 风险评估

### 高风险
1. **豆包API调用失败**
   - 原因：API密钥配置错误、网络连接问题、API服务异常
   - 缓解方案：完善错误处理、添加重试机制、提供调试工具

2. **浏览器内存限制**
   - 原因：超大文件（>5MB）可能导致浏览器卡顿
   - 缓解方案：文件大小检查、分块处理、提示用户

### 中风险
3. **markdown处理复杂**
   - 原因：某些markdown语法可能不被正确识别
   - 缓解方案：使用成熟的remark库、充分测试

4. **跨域问题**
   - 原因：豆包API可能不支持直接跨域请求
   - 缓解方案：使用CORS代理或后端代理

### 低风险
5. **依赖包更新**
   - 原因：npm依赖可能有安全漏洞或不兼容
   - 缓解方案：定期npm audit，锁定重要依赖版本

---

## 质保计划

### 单元测试
```bash
npm install -D vitest @testing-library/react

# 测试覆盖率目标 > 80%
```

### 集成测试
- [ ] Store状态管理测试
- [ ] API调用测试
- [ ] 组件交互测试

### 用户验收测试（UAT）
1. 邀请2-3位朋友测试
2. 收集反馈
3. 修复发现的问题

### 性能测试
- [ ] Lighthouse评分 > 90
- [ ] 首屏加载时间 < 3s
- [ ] 大文件处理（5MB+）

### 兼容性测试
- [ ] Chrome（最新版）
- [ ] Firefox（最新版）
- [ ] Safari（最新版）
- [ ] Edge（最新版）
- [ ] 移动浏览器（iOS Safari、Chrome Android）

---

## 关键决策点

| 决策 | 选项 | 推荐 | 原因 |
|------|------|------|------|
| 状态管理 | Redux / Zustand / Context | **Zustand** | 轻量级、易上手 |
| UI框架 | Material-UI / shadcn / Ant Design | **shadcn** | 美观、定制性强 |
| 部署方式 | Vercel / Netlify / 自己服务器 | **Vercel** | 免费、自动部署 |
| 后端代理 | 需要 / 不需要 | **可选** | 取决于API限制 |

---

## 检查清单

### 上线前检查
- [ ] 所有功能测试通过
- [ ] 无console.error/warning
- [ ] .env正确配置
- [ ] .gitignore配置完成
- [ ] README文档完善
- [ ] 性能测试通过
- [ ] 浏览器兼容性测试通过
- [ ] 用户UAT反馈处理完毕
- [ ] 代码review完成
- [ ] 部署验证成功

---

## 沟通计划

### 日常沟通
- 每天同步开发进度（15分钟）
- 遇到阻碍立即报告

### 周期同步
- 阶段完成后进行演示和反馈
- 根据反馈调整下一阶段计划

### 文档更新
- 每个阶段完成后更新此文档
- 保持清单同步

---

## 下一步行动

1. **立即**：审核此文档，确认是否有遗漏或修改
2. **今天**：开始阶段1项目初始化
3. **明天**：阶段2开发开始

---

**最后更新**：2026-03-23  
**CTO签署**：GitHub Copilot  
**项目经理**：You
