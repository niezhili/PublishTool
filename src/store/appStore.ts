import { create } from 'zustand'
import { AppState } from '@/types'

/**
 * 定义Store的接口
 * 包括状态属性和修改状态的方法
 */
interface AppStateStore extends AppState {
  // 文本编辑方法
  setOriginalText: (text: string) => void
  setPolishedText: (text: string) => void

  // 润色设置
  setPolishingRequirement: (requirement: string) => void

  // 图片管理
  setGeneratedImages: (images: string[]) => void

  // 状态管理
  setIsLoading: (loading: boolean) => void
  setError: (error: string | undefined) => void

  // 重置所有状态
  reset: () => void
}

/**
 * 初始状态定义
 */
const initialState: AppState = {
  originalText: '',
  polishedText: '',
  polishingRequirement: '这是我写的文章初稿，我要发博客，帮我润色文章',
  generatedImages: [],
  isLoading: false,
  error: undefined,
}

/**
 * 创建全局Store
 * useAppStore() 可以在任何组件中调用
 */
export const useAppStore = create<AppStateStore>((set) => ({
  // 展开初始状态
  ...initialState,

  // 文本编辑方法
  setOriginalText: (text) => set({ originalText: text }),
  setPolishedText: (text) => set({ polishedText: text }),

  // 润色设置
  setPolishingRequirement: (requirement) =>
    set({ polishingRequirement: requirement }),

  // 图片管理
  setGeneratedImages: (images) => set({ generatedImages: images }),

  // 状态管理
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // 重置所有状态（退出后清空）
  reset: () => set(initialState),
}))
