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
