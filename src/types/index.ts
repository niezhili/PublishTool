export interface TextPolishRequest {
  content: string
  requirement?: string
}

export interface TextPolishResponse {
  polishedContent: string
  originalContent: string
}

export interface ImageGenerationRequest {
  prompt: string
  width: number
  height: number
  count: number
  model?: string
}

export interface ImageGenerationResponse {
  images: string[] // base64 or URLs
}

export interface AppState {
  originalText: string
  polishedText: string
  polishingRequirement: string
  generatedImages: string[]
  isLoading: boolean
  error?: string
}
