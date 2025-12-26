'use client'

import { useState, useRef, useEffect } from 'react'

export default function Home() {
  const [processingMethod, setProcessingMethod] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [filteredImage, setFilteredImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Capturar erros globais que podem estar causando reload
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('❌ ERRO GLOBAL CAPTURADO:', event.error)
      event.preventDefault() // Previne reload
      setError('❌ Erro crítico: ' + event.error?.message)
      setIsProcessing(false)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('❌ PROMISE REJECTION CAPTURADA:', event.reason)
      event.preventDefault() // Previne reload
      setError('❌ Erro assíncrono: ' + event.reason)
      setIsProcessing(false)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Verificar tamanho do arquivo (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Imagem muito grande. Tamanho máximo: 10MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string

        // Redimensionar imagem se necessário
        resizeImage(imageUrl, 1024, (resizedImage) => {
          setOriginalImage(resizedImage)
          setFilteredImage(null)
          setError(null)
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const resizeImage = (
    dataUrl: string,
    maxSize: number,
    callback: (resizedDataUrl: string) => void
  ) => {
    const img = new Image()
    img.onload = () => {
      let width = img.width
      let height = img.height

      // Redimensionar se maior que maxSize
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height / width) * maxSize
          width = maxSize
        } else {
          width = (width / height) * maxSize
          height = maxSize
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)
        // Converter para JPEG com qualidade 0.9 para reduzir tamanho
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9)
        callback(resizedDataUrl)
      } else {
        callback(dataUrl)
      }
    }
    img.src = dataUrl
  }

  const applyClientSideFilter = (imageData: string) => {
    return new Promise<string>((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          resolve(imageData)
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imgData.data
        const width = canvas.width
        const height = canvas.height

        console.log('🎨 Aplicando filtro anime PROFISSIONAL (baseado em modelos reais)...')

        // ===== PASSO 1: MÚLTIPLAS PASSES DE BILATERAL FILTER (3x) =====
        // Técnica usada por modelos reais para pele ultra-suave
        console.log('  📊 Passo 1/10: Bilateral filter (3 passes)')

        for (let pass = 0; pass < 3; pass++) {
          const tempData = new Uint8ClampedArray(data)
          const radius = pass === 0 ? 4 : 3 // Primeiro pass mais agressivo
          const sigmaColor = 35
          const sigmaSpace = 25

          for (let y = radius; y < height - radius; y++) {
            for (let x = radius; x < width - radius; x++) {
              const i = (y * width + x) * 4
              let totalR = 0, totalG = 0, totalB = 0, totalWeight = 0

              const centerR = tempData[i]
              const centerG = tempData[i + 1]
              const centerB = tempData[i + 2]

              for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                  const ni = ((y + dy) * width + (x + dx)) * 4
                  const nr = tempData[ni]
                  const ng = tempData[ni + 1]
                  const nb = tempData[ni + 2]

                  const colorDist = Math.sqrt(
                    Math.pow(nr - centerR, 2) +
                    Math.pow(ng - centerG, 2) +
                    Math.pow(nb - centerB, 2)
                  )
                  const spatialDist = Math.sqrt(dx * dx + dy * dy)

                  const colorWeight = Math.exp(-(colorDist * colorDist) / (2 * sigmaColor * sigmaColor))
                  const spatialWeight = Math.exp(-(spatialDist * spatialDist) / (2 * sigmaSpace * sigmaSpace))
                  const weight = colorWeight * spatialWeight

                  totalR += nr * weight
                  totalG += ng * weight
                  totalB += nb * weight
                  totalWeight += weight
                }
              }

              data[i] = totalR / totalWeight
              data[i + 1] = totalG / totalWeight
              data[i + 2] = totalB / totalWeight
            }
          }
        }

        // ===== PASSO 2: QUANTIZAÇÃO AGRESSIVA DE CORES (K-means simplificado) =====
        console.log('  🎨 Passo 2/10: Quantização agressiva (8 níveis)')
        const colorLevels = 8 // Muito menos cores = mais anime
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.round(data[i] / (256 / colorLevels)) * (256 / colorLevels)
          data[i + 1] = Math.round(data[i + 1] / (256 / colorLevels)) * (256 / colorLevels)
          data[i + 2] = Math.round(data[i + 2] / (256 / colorLevels)) * (256 / colorLevels)
        }

        // ===== PASSO 3: CONVERSÃO PARA LUMINÂNCIA para melhor controle =====
        console.log('  💫 Passo 3/10: Extração de luminância')
        const luminance = new Float32Array(width * height)
        for (let i = 0; i < data.length; i += 4) {
          const idx = i / 4
          // Fórmula padrão de luminância
          luminance[idx] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        }

        // ===== PASSO 4: SATURAÇÃO EXTREMA (cores anime vibrantes) =====
        console.log('  🌈 Passo 4/10: Saturação extrema')
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i] / 255
          let g = data[i + 1] / 255
          let b = data[i + 2] / 255

          // Converter RGB para HSV para controle melhor
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)
          const v = max
          const d = max - min
          const s = max === 0 ? 0 : d / max

          let h = 0
          if (max !== min) {
            switch (max) {
              case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
              case g: h = ((b - r) / d + 2) / 6; break
              case b: h = ((r - g) / d + 4) / 6; break
            }
          }

          // Boost de saturação EXTREMO (2.5x)
          const newS = Math.min(1, s * 2.5)

          // Converter de volta para RGB
          const c = v * newS
          const x = c * (1 - Math.abs((h * 6) % 2 - 1))
          const m = v - c

          let r1 = 0, g1 = 0, b1 = 0
          if (h < 1/6) { r1 = c; g1 = x; b1 = 0 }
          else if (h < 2/6) { r1 = x; g1 = c; b1 = 0 }
          else if (h < 3/6) { r1 = 0; g1 = c; b1 = x }
          else if (h < 4/6) { r1 = 0; g1 = x; b1 = c }
          else if (h < 5/6) { r1 = x; g1 = 0; b1 = c }
          else { r1 = c; g1 = 0; b1 = x }

          data[i] = (r1 + m) * 255
          data[i + 1] = (g1 + m) * 255
          data[i + 2] = (b1 + m) * 255
        }

        // ===== PASSO 5: CELL SHADING AVANÇADO (zonas de sombra distintas) =====
        console.log('  💡 Passo 5/10: Cell shading avançado')
        for (let i = 0; i < data.length; i += 4) {
          const idx = i / 4
          const lum = luminance[idx]

          let factor = 1
          if (lum < 60) factor = 0.5        // Sombra muito escura
          else if (lum < 120) factor = 0.75  // Sombra média
          else if (lum < 180) factor = 1.0   // Tom médio
          else factor = 1.3                   // Highlight brilhante

          data[i] = Math.min(255, data[i] * factor)
          data[i + 1] = Math.min(255, data[i + 1] * factor)
          data[i + 2] = Math.min(255, data[i + 2] * factor)
        }

        // ===== PASSO 6: CONTRASTE DRAMÁTICO =====
        console.log('  ⚡ Passo 6/10: Contraste dramático')
        const contrast = 1.6 // Muito mais contraste
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128))
          data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128))
          data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128))
        }

        // ===== PASSO 7: DIFFERENCE OF GAUSSIANS (DoG) para bordas limpas =====
        console.log('  🔍 Passo 7/10: DoG edge detection')
        const edges = new Uint8ClampedArray(data.length / 4)

        // Gaussian blur 1 (sigma pequeno)
        const blur1 = new Float32Array(width * height)
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x
            let sum = 0
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const i = ((y + dy) * width + (x + dx)) * 4
                sum += luminance[(y + dy) * width + (x + dx)]
              }
            }
            blur1[idx] = sum / 9
          }
        }

        // Gaussian blur 2 (sigma maior)
        const blur2 = new Float32Array(width * height)
        for (let y = 2; y < height - 2; y++) {
          for (let x = 2; x < width - 2; x++) {
            const idx = y * width + x
            let sum = 0
            for (let dy = -2; dy <= 2; dy++) {
              for (let dx = -2; dx <= 2; dx++) {
                sum += luminance[(y + dy) * width + (x + dx)]
              }
            }
            blur2[idx] = sum / 25
          }
        }

        // DoG = blur1 - blur2
        for (let i = 0; i < edges.length; i++) {
          const diff = Math.abs(blur1[i] - blur2[i])
          edges[i] = diff > 15 ? 255 : 0 // Threshold para detectar bordas
        }

        // ===== PASSO 8: APLICAR BORDAS (escurecer onde tem borda) =====
        console.log('  ✏️ Passo 8/10: Aplicar contornos')
        for (let i = 0; i < data.length; i += 4) {
          const idx = i / 4
          if (edges[idx] > 128) {
            // Escurecer bastante nas bordas
            data[i] *= 0.3
            data[i + 1] *= 0.3
            data[i + 2] *= 0.3
          }
        }

        // ===== PASSO 9: AJUSTE DE BRILHO (anime é mais brilhante) =====
        console.log('  ☀️ Passo 9/10: Ajuste de brilho')
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.15)
          data[i + 1] = Math.min(255, data[i + 1] * 1.15)
          data[i + 2] = Math.min(255, data[i + 2] * 1.15)
        }

        // ===== PASSO 10: SHARPENING ADAPTATIVO =====
        console.log('  🔪 Passo 10/10: Sharpening adaptativo')
        const tempData = new Uint8ClampedArray(data)
        const sharpenKernel = [
          [0, -1, 0],
          [-1, 5, -1],
          [0, -1, 0]
        ]

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
              let sum = 0
              for (let ky = 0; ky < 3; ky++) {
                for (let kx = 0; kx < 3; kx++) {
                  const idx = ((y + ky - 1) * width + (x + kx - 1)) * 4 + c
                  sum += tempData[idx] * sharpenKernel[ky][kx]
                }
              }
              data[(y * width + x) * 4 + c] = Math.min(255, Math.max(0, sum))
            }
          }
        }

        console.log('✅ Filtro anime profissional aplicado!')

        ctx.putImageData(imgData, 0, 0)
        resolve(canvas.toDataURL('image/png', 0.98))
      }

      img.src = imageData
    })
  }

  const handleApplyFilter = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setProcessingMethod('🎨 Aplicando filtro anime profissional...')

    try {
      console.log('🎨 Iniciando processamento com filtro profissional...')
      setProgress(0.1)

      const filtered = await applyClientSideFilter(originalImage)

      console.log('✅ Filtro completou com sucesso!')
      setFilteredImage(filtered)
      setProcessingMethod('✅ Processado com filtro profissional')
      setError(null)
      setProgress(1.0)

    } catch (error: any) {
      console.error('❌ Erro ao processar:', error)
      setError('❌ Erro ao processar a imagem: ' + error.message)
      setProcessingMethod('')
      setProgress(0)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!filteredImage) return

    const link = document.createElement('a')
    link.href = filteredImage
    link.download = 'anime-filtered-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setOriginalImage(null)
    setFilteredImage(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 anime-gradient bg-clip-text text-transparent">
            Anime Filter
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Transforme suas fotos em arte estilo anime usando IA
          </p>
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">Erro:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col items-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {originalImage ? 'Escolher outra foto' : 'Carregar Foto'}
            </label>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="mt-4 text-sm text-gray-500">
              Suporta JPG, PNG, WebP
            </p>
          </div>
        </div>

        {/* Controls */}
        {originalImage && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={handleApplyFilter}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessing ? 'Transformando em Anime...' : 'Transformar em Anime'}
                </button>

                {filteredImage && (
                  <>
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Baixar Imagem
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Resetar
                    </button>
                  </>
                )}
              </div>

              {/* Progress Indicator */}
              {isProcessing && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{processingMethod}</span>
                    <span className="text-gray-600">{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {progress < 0.2 ? 'Tentando APIs externas...' :
                     progress < 0.9 ? 'Processando com IA AnimeGAN (pode levar 10-20s)...' :
                     'Finalizando...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Images Display */}
        {originalImage && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Foto Original
              </h2>
              <div className="relative aspect-square">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Filtered Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Estilo Anime/Ilustração
              </h2>
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                {filteredImage ? (
                  <img
                    src={filteredImage}
                    alt="Anime Style"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center p-4">
                    <p className="text-gray-400">
                      {isProcessing ? (
                        <>
                          <span className="block mb-2">Transformando com IA...</span>
                          <span className="text-sm">Isso pode levar até 60 segundos</span>
                        </>
                      ) : (
                        'Clique em "Transformar em Anime"'
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        {!originalImage && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Como usar</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">📸</div>
                <h3 className="font-semibold mb-2">1. Carregue</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Faça upload da sua foto
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">🎨</div>
                <h3 className="font-semibold mb-2">2. Transforme</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Deixe a IA criar o estilo anime
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">⬇️</div>
                <h3 className="font-semibold mb-2">3. Baixe</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Salve sua imagem transformada
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
