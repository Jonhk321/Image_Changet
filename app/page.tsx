'use client'

import { useState, useRef } from 'react'
import { applyAnimeFilter } from '@/lib/animeFilter'

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [filteredImage, setFilteredImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [filterIntensity, setFilterIntensity] = useState(50)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setOriginalImage(imageUrl)
        setFilteredImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleApplyFilter = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    try {
      const filtered = await applyAnimeFilter(originalImage, filterIntensity)
      setFilteredImage(filtered)
    } catch (error) {
      console.error('Erro ao aplicar filtro:', error)
      alert('Erro ao processar a imagem')
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
            Transforme suas fotos em arte estilo anime
          </p>
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
              <div>
                <label className="block text-sm font-medium mb-2">
                  Intensidade do Filtro: {filterIntensity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filterIntensity}
                  onChange={(e) => setFilterIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>

              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={handleApplyFilter}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessing ? 'Processando...' : 'Aplicar Filtro Anime'}
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
                Com Filtro Anime
              </h2>
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                {filteredImage ? (
                  <img
                    src={filteredImage}
                    alt="Filtered"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <p className="text-gray-400">
                    {isProcessing ? 'Processando...' : 'Clique em "Aplicar Filtro"'}
                  </p>
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
                <h3 className="font-semibold mb-2">2. Ajuste</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Configure a intensidade do filtro
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
