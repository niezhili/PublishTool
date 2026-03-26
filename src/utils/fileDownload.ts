import { saveAs } from 'file-saver'

function getImageExtension(imageSource: string): string {
  if (imageSource.startsWith('data:image/')) {
    const match = imageSource.match(/^data:image\/([a-zA-Z0-9+.-]+);/)
    if (match?.[1]) {
      return match[1] === 'jpeg' ? 'jpg' : match[1]
    }
  }

  try {
    const url = new URL(imageSource)
    const pathname = url.pathname.toLowerCase()

    if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
      return 'jpg'
    }

    if (pathname.endsWith('.webp')) {
      return 'webp'
    }

    if (pathname.endsWith('.gif')) {
      return 'gif'
    }
  } catch {
    // 非 URL 或 data URL 时忽略，回退为 png。
  }

  return 'png'
}

export async function downloadImage(imageSource: string, filenameBase: string): Promise<void> {
  const extension = getImageExtension(imageSource)
  const filename = `${filenameBase}.${extension}`

  if (imageSource.startsWith('data:')) {
    const response = await fetch(imageSource)
    const blob = await response.blob()
    saveAs(blob, filename)
    return
  }

  try {
    const response = await fetch(imageSource)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const blob = await response.blob()
    saveAs(blob, filename)
  } catch (error) {
    const fallbackLink = document.createElement('a')
    fallbackLink.href = imageSource
    fallbackLink.download = filename
    fallbackLink.target = '_blank'
    fallbackLink.rel = 'noopener noreferrer'
    fallbackLink.click()

    console.warn('[downloadImage] 已回退为浏览器原生下载方式', error)
  }
}