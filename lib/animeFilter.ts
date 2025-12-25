/**
 * Aplica um filtro de anime em uma imagem
 * @param imageUrl URL da imagem original
 * @param intensity Intensidade do filtro (0-100)
 * @returns Promise com a URL da imagem processada
 */
export async function applyAnimeFilter(
  imageUrl: string,
  intensity: number = 50
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'))
          return
        }

        canvas.width = img.width
        canvas.height = img.height

        // Desenhar imagem original
        ctx.drawImage(img, 0, 0)

        // Obter dados da imagem
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Normalizar intensidade (0-1)
        const normalizedIntensity = intensity / 100

        // Aplicar efeitos do filtro anime
        applyAnimeEffect(data, normalizedIntensity)

        // Aplicar posterização (redução de cores)
        posterize(data, normalizedIntensity)

        // Aumentar saturação
        adjustSaturation(data, 1 + normalizedIntensity * 0.5)

        // Aumentar contraste
        adjustContrast(data, 1 + normalizedIntensity * 0.3)

        // Colocar dados processados de volta no canvas
        ctx.putImageData(imageData, 0, 0)

        // Aplicar edge enhancement (contornos)
        if (normalizedIntensity > 0.3) {
          applyEdgeEnhancement(ctx, canvas.width, canvas.height, normalizedIntensity)
        }

        // Converter canvas para URL
        resolve(canvas.toDataURL('image/png'))
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Erro ao carregar a imagem'))
    }

    img.src = imageUrl
  })
}

/**
 * Aplica efeito anime básico (suavização seletiva e ajuste de cores)
 */
function applyAnimeEffect(data: Uint8ClampedArray, intensity: number): void {
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]

    // Brightening e color pop
    const brightnessBoost = 1 + intensity * 0.1
    r = Math.min(255, r * brightnessBoost)
    g = Math.min(255, g * brightnessBoost)
    b = Math.min(255, b * brightnessBoost)

    // Efeito de pele suave (detectar tons de pele)
    if (isSkinTone(r, g, b)) {
      const smoothing = intensity * 15
      r = smoothValue(r, smoothing)
      g = smoothValue(g, smoothing)
      b = smoothValue(b, smoothing)
    }

    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
  }
}

/**
 * Posterização - reduz o número de cores para dar efeito cartoon
 */
function posterize(data: Uint8ClampedArray, intensity: number): void {
  // Quanto maior a intensidade, menos níveis de cor
  const levels = Math.floor(256 / (2 + intensity * 10))

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.floor(data[i] / levels) * levels
    data[i + 1] = Math.floor(data[i + 1] / levels) * levels
    data[i + 2] = Math.floor(data[i + 2] / levels) * levels
  }
}

/**
 * Ajusta a saturação da imagem
 */
function adjustSaturation(data: Uint8ClampedArray, factor: number): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Converter para HSL para ajustar saturação
    const gray = 0.2989 * r + 0.587 * g + 0.114 * b

    data[i] = clamp(gray + factor * (r - gray))
    data[i + 1] = clamp(gray + factor * (g - gray))
    data[i + 2] = clamp(gray + factor * (b - gray))
  }
}

/**
 * Ajusta o contraste da imagem
 */
function adjustContrast(data: Uint8ClampedArray, factor: number): void {
  const intercept = 128 * (1 - factor)

  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] * factor + intercept)
    data[i + 1] = clamp(data[i + 1] * factor + intercept)
    data[i + 2] = clamp(data[i + 2] * factor + intercept)
  }
}

/**
 * Aplica edge enhancement para destacar contornos
 */
function applyEdgeEnhancement(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const edges = new Uint8ClampedArray(data.length)

  // Kernel Sobel para detecção de bordas
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0,
        gy = 0

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4
          const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]

          const kernelIdx = (ky + 1) * 3 + (kx + 1)
          gx += gray * sobelX[kernelIdx]
          gy += gray * sobelY[kernelIdx]
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy)
      const edgeIdx = (y * width + x) * 4

      // Aplicar edge com intensidade
      const edgeStrength = Math.min(255, magnitude * intensity * 0.5)
      edges[edgeIdx] = edgeStrength
      edges[edgeIdx + 1] = edgeStrength
      edges[edgeIdx + 2] = edgeStrength
      edges[edgeIdx + 3] = 255
    }
  }

  // Combinar edges com imagem original
  for (let i = 0; i < data.length; i += 4) {
    const edgeValue = edges[i]
    if (edgeValue > 30) {
      // Se houver uma borda forte, escurecer
      const darkening = edgeValue / 255
      data[i] = data[i] * (1 - darkening * 0.7)
      data[i + 1] = data[i + 1] * (1 - darkening * 0.7)
      data[i + 2] = data[i + 2] * (1 - darkening * 0.7)
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

/**
 * Detecta se é um tom de pele
 */
function isSkinTone(r: number, g: number, b: number): boolean {
  return (
    r > 95 &&
    g > 40 &&
    b > 20 &&
    r > g &&
    r > b &&
    Math.abs(r - g) > 15 &&
    r - g < 90 &&
    r - b < 90
  )
}

/**
 * Suaviza um valor de cor
 */
function smoothValue(value: number, range: number): number {
  return Math.round(value / range) * range
}

/**
 * Limita valor entre 0-255
 */
function clamp(value: number): number {
  return Math.min(255, Math.max(0, value))
}
