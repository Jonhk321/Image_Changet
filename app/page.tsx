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

  const handleApplyFilter = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/anime-filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: originalImage }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar a imagem')
      }

      setFilteredImage(data.output)
    } catch (error: any) {
      console.error('Erro ao aplicar filtro:', error)
      setError(error.message || 'Erro ao processar a imagem')
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
                  {isProcessing ? 'Transformando em Anime... (pode levar até 60s)' : 'Transformar em Anime com IA'}
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
