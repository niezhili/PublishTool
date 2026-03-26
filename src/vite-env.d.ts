/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEXT_POLISH_API_URL: string
  readonly VITE_TEXT_POLISH_API_KEY: string
  readonly VITE_IMAGE_GEN_API_URL: string
  readonly VITE_IMAGE_GEN_API_KEY: string
  readonly VITE_TEXT_MODEL_NAME: string
  readonly VITE_IMAGE_MODEL_NAME: string
  readonly VITE_TEMPERATURE: string
  readonly VITE_TOP_P: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
