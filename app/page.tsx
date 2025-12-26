'use client'

import { useState, useRef } from 'react'

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [filteredImage, setFilteredImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

        console.log('🎨 Aplicando filtro anime profissional...')

        // ===== PASSO 1: BILATERAL FILTER (Suavização preservando bordas) =====
        console.log('  📊 Passo 1/8: Bilateral filter')
        const originalData = new Uint8ClampedArray(data)
        const radius = 3
        const sigmaColor = 30
        const sigmaSpace = 20

        for (let y = radius; y < canvas.height - radius; y++) {
          for (let x = radius; x < canvas.width - radius; x++) {
            const i = (y * canvas.width + x) * 4
            let totalR = 0, totalG = 0, totalB = 0, totalWeight = 0

            const centerR = originalData[i]
            const centerG = originalData[i + 1]
            const centerB = originalData[i + 2]

            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const ni = ((y + dy) * canvas.width + (x + dx)) * 4
                const nr = originalData[ni]
                const ng = originalData[ni + 1]
                const nb = originalData[ni + 2]

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

        // ===== PASSO 2: QUANTIZAÇÃO DE CORES (Paleta Anime) =====
        console.log('  🎨 Passo 2/8: Quantização de cores')
        const colorLevels = 12 // Menos níveis = mais estilo anime
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.round(data[i] / (255 / colorLevels)) * (255 / colorLevels)
          data[i + 1] = Math.round(data[i + 1] / (255 / colorLevels)) * (255 / colorLevels)
          data[i + 2] = Math.round(data[i + 2] / (255 / colorLevels)) * (255 / colorLevels)
        }

        // ===== PASSO 3: SATURAÇÃO ANIME (Cores vibrantes) =====
        console.log('  🌈 Passo 3/8: Saturação anime')
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Converter para HSL
          const max = Math.max(r, g, b) / 255
          const min = Math.min(r, g, b) / 255
          const l = (max + min) / 2

          if (max !== min) {
            const d = max - min
            const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            // Aumentar saturação dramaticamente
            const newS = Math.min(1, s * 1.8)

            // Converter de volta para RGB
            const hue = max === r / 255
              ? ((g / 255 - b / 255) / d + (g < b ? 6 : 0)) / 6
              : max === g / 255
              ? ((b / 255 - r / 255) / d + 2) / 6
              : ((r / 255 - g / 255) / d + 4) / 6

            const q = l < 0.5 ? l * (1 + newS) : l + newS - l * newS
            const p = 2 * l - q

            const hue2rgb = (p: number, q: number, t: number) => {
              if (t < 0) t += 1
              if (t > 1) t -= 1
              if (t < 1/6) return p + (q - p) * 6 * t
              if (t < 1/2) return q
              if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
              return p
            }

            data[i] = hue2rgb(p, q, hue + 1/3) * 255
            data[i + 1] = hue2rgb(p, q, hue) * 255
            data[i + 2] = hue2rgb(p, q, hue - 1/3) * 255
          }
        }

        // ===== PASSO 4: CELL SHADING (Sombreamento estilo anime) =====
        console.log('  💡 Passo 4/8: Cell shading')
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3

          // Definir limites para sombreamento
          let shadingFactor = 1.0
          if (brightness < 85) {
            shadingFactor = 0.6 // Sombra escura
          } else if (brightness < 170) {
            shadingFactor = 0.85 // Meia sombra
          } else {
            shadingFactor = 1.15 // Realce
          }

          data[i] = Math.min(255, data[i] * shadingFactor)
          data[i + 1] = Math.min(255, data[i + 1] * shadingFactor)
          data[i + 2] = Math.min(255, data[i + 2] * shadingFactor)
        }

        // ===== PASSO 5: CONTRAST ENHANCEMENT (Contraste dramático) =====
        console.log('  ⚡ Passo 5/8: Contraste')
        const contrast = 1.4
        const factor = (259 * (contrast * 100 + 255)) / (255 * (259 - contrast * 100))
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128))
          data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128))
          data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128))
        }

        ctx.putImageData(imgData, 0, 0)

        // ===== PASSO 6: EDGE DETECTION & OUTLINING (Contornos anime) =====
        console.log('  ✏️ Passo 6/8: Detecção de bordas')
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          tempCanvas.width = canvas.width
          tempCanvas.height = canvas.height
          tempCtx.drawImage(canvas, 0, 0)

          const imageData2 = tempCtx.getImageData(0, 0, canvas.width, canvas.height)
          const data2 = imageData2.data

          // Sobel operator aprimorado para bordas anime
          for (let y = 1; y < canvas.height - 1; y++) {
            for (let x = 1; x < canvas.width - 1; x++) {
              const i = (y * canvas.width + x) * 4

              // Calcular gradiente em cada canal de cor
              let totalGradient = 0
              for (let c = 0; c < 3; c++) {
                const gx =
                  -data2[((y-1)*canvas.width + (x-1))*4 + c] + data2[((y-1)*canvas.width + (x+1))*4 + c] +
                  -2*data2[(y*canvas.width + (x-1))*4 + c] + 2*data2[(y*canvas.width + (x+1))*4 + c] +
                  -data2[((y+1)*canvas.width + (x-1))*4 + c] + data2[((y+1)*canvas.width + (x+1))*4 + c]

                const gy =
                  -data2[((y-1)*canvas.width + (x-1))*4 + c] - 2*data2[((y-1)*canvas.width + x)*4 + c] - data2[((y-1)*canvas.width + (x+1))*4 + c] +
                  data2[((y+1)*canvas.width + (x-1))*4 + c] + 2*data2[((y+1)*canvas.width + x)*4 + c] + data2[((y+1)*canvas.width + (x+1))*4 + c]

                totalGradient += Math.sqrt(gx*gx + gy*gy)
              }

              // Bordas fortes = contornos anime (pretos)
              if (totalGradient > 80) {
                const strength = Math.min(1, totalGradient / 150)
                imgData.data[i] = imgData.data[i] * (1 - strength * 0.7)
                imgData.data[i+1] = imgData.data[i+1] * (1 - strength * 0.7)
                imgData.data[i+2] = imgData.data[i+2] * (1 - strength * 0.7)
              }
            }
          }

          ctx.putImageData(imgData, 0, 0)
        }

        // ===== PASSO 7: AJUSTE DE BRILHO (Iluminação anime) =====
        console.log('  ☀️ Passo 7/8: Ajuste de brilho')
        const finalData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < finalData.data.length; i += 4) {
          finalData.data[i] = Math.min(255, finalData.data[i] * 1.12)
          finalData.data[i + 1] = Math.min(255, finalData.data[i + 1] * 1.12)
          finalData.data[i + 2] = Math.min(255, finalData.data[i + 2] * 1.12)
        }
        ctx.putImageData(finalData, 0, 0)

        // ===== PASSO 8: SHARPENING (Nitidez final) =====
        console.log('  🔍 Passo 8/8: Sharpening')
        const sharpenData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const sharpenKernel = [
          0, -0.5, 0,
          -0.5, 3, -0.5,
          0, -0.5, 0
        ]

        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            for (let c = 0; c < 3; c++) {
              let sum = 0
              let ki = 0
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const pixelIndex = ((y + ky) * canvas.width + (x + kx)) * 4 + c
                  sum += finalData.data[pixelIndex] * sharpenKernel[ki]
                  ki++
                }
              }
              const i = (y * canvas.width + x) * 4 + c
              sharpenData.data[i] = Math.min(255, Math.max(0, sum))
            }
          }
        }
        ctx.putImageData(sharpenData, 0, 0)

        console.log('✨ Filtro anime profissional aplicado com sucesso!')
        resolve(canvas.toDataURL('image/png', 0.98))
      }
      img.src = imageData
    })
  }

  const handleApplyFilter = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    setError(null)

    try {
      // Tentar API com múltiplos endpoints
      const response = await fetch('/api/anime-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: originalImage }),
      })

      const data = await response.json()

      if (!response.ok && data.useClientSide) {
        console.log('Todas as APIs falharam, usando filtro local...')
        const filtered = await applyClientSideFilter(originalImage)
        setFilteredImage(filtered)
        setError('⚠️ APIs de IA indisponíveis. Usando filtro local (qualidade reduzida).')
        return
      }

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar')
      }

      setFilteredImage(data.output)
      setError(null) // Limpar erro se sucesso
    } catch (error: any) {
      console.error('Erro:', error)
      try {
        const filtered = await applyClientSideFilter(originalImage)
        setFilteredImage(filtered)
        setError('⚠️ Erro de conexão. Usando filtro local.')
      } catch {
        setError('❌ Erro ao processar a imagem')
      }
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
