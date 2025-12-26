import * as tf from '@tensorflow/tfjs'
import * as tfc from '@tensorflow/tfjs-converter'

// Registrar operação customizada MirrorPad
function mirrorPadFunc(input: tf.Tensor, pad_arr: number[][]) {
  return tf.tidy(() => {
    let result = input
    for (let i = 0; i < 4; i++) {
      if (pad_arr[i][0] !== 0 || pad_arr[i][1] !== 0) {
        let slice_size = [-1, -1, -1, -1]
        slice_size[i] = pad_arr[i][0]
        let slice_begin = [0, 0, 0, 0]

        let padding_left = result.slice(slice_begin, slice_size)

        slice_size = [-1, -1, -1, -1]
        slice_size[i] = pad_arr[i][1]
        slice_begin = [0, 0, 0, 0]
        slice_begin[i] = result.shape[i] - pad_arr[i][1]

        let padding_right = result.slice(slice_begin, slice_size)

        result = tf.concat([padding_left, result, padding_right], i)
      }

      if (pad_arr[i][0] > 1 || pad_arr[i][1] > 1) {
        throw new Error("Only input with no more than length one in padding is supported")
      }
    }
    return result
  })
}

// Registrar operação MirrorPad customizada
const mirrorPad = async (node: any) => {
  await tf.nextFrame()

  if (node.attrs.mode !== "reflect") {
    throw new Error("Only reflect mode is supported. Mode: " + node.attrs.mode)
  }

  let pad_tensor = node.inputs[1]

  if (node.inputs[0].shape.length === 4) {
    let pad_arr = await pad_tensor.array()
    let input = node.inputs[0]
    return mirrorPadFunc(input, pad_arr)
  } else {
    throw new Error("Only input of rank 4 is supported")
  }
}

// Registrar apenas uma vez
let isRegistered = false
function registerCustomOp() {
  if (!isRegistered) {
    tfc.registerOp('MirrorPad', mirrorPad)
    isRegistered = true
  }
}

export interface AnimeGANOptions {
  maxSize?: number  // Tamanho máximo do lado longo (default: 512)
  onProgress?: (progress: number) => void
}

export async function transformToAnime(
  imageDataUrl: string,
  options: AnimeGANOptions = {}
): Promise<string> {
  const { maxSize = 512, onProgress } = options

  console.log('🎨 Iniciando transformação AnimeGAN (IA real)...')

  // Registrar operação customizada
  registerCustomOp()

  // Ativar modo de produção para melhor performance
  tf.enableProdMode()

  try {
    // 1. Carregar imagem
    if (onProgress) onProgress(0.1)
    const img = await loadImage(imageDataUrl)

    // 2. Carregar modelo
    if (onProgress) onProgress(0.2)
    console.log('📦 Carregando modelo AnimeGAN (~15MB)...')
    const modelUrl = '/models/animegan/model.json'
    const model = await tfc.loadGraphModel(modelUrl)
    console.log('✅ Modelo carregado!')

    // 3. Processar imagem
    if (onProgress) onProgress(0.4)
    console.log('🖼️ Processando imagem...')

    const imgTensor = tf.browser.fromPixels(img)
    console.log('Tamanho original:', imgTensor.shape)

    // Redimensionar se necessário
    let scaledTensor: tf.Tensor
    const longSide = Math.max(imgTensor.shape[0], imgTensor.shape[1])

    if (longSide > maxSize) {
      const scaleFactor = longSide / maxSize
      const scaledSize = [
        Math.round(imgTensor.shape[0] / scaleFactor),
        Math.round(imgTensor.shape[1] / scaleFactor)
      ]
      console.log('Redimensionando para:', scaledSize)
      scaledTensor = tf.tidy(() =>
        tf.image.resizeBilinear(imgTensor, scaledSize as [number, number])
          .expandDims(0)
          .div(255)
      )
    } else {
      scaledTensor = tf.tidy(() =>
        imgTensor.expandDims(0).div(255)
      )
    }

    imgTensor.dispose()

    // 4. Executar modelo
    if (onProgress) onProgress(0.5)
    console.log('🚀 Executando AnimeGAN...')
    const startTime = performance.now()

    const generated = await model.executeAsync({'test': scaledTensor}) as tf.Tensor

    const elapsed = ((performance.now() - startTime) / 1000).toFixed(1)
    console.log(`✨ Transformação concluída em ${elapsed}s!`)

    scaledTensor.dispose()

    // 5. Converter resultado para imagem
    if (onProgress) onProgress(0.9)
    const canvas = document.createElement('canvas')
    const outputTensor = tf.tidy(() =>
      generated.squeeze([0]).add(1).div(2)
    ) as tf.Tensor3D

    await tf.browser.toPixels(outputTensor, canvas)

    generated.dispose()
    outputTensor.dispose()
    model.dispose()

    // 6. Retornar data URL
    if (onProgress) onProgress(1.0)
    const resultDataUrl = canvas.toDataURL('image/png', 0.95)

    console.log('✅ AnimeGAN: Transformação completa!')
    return resultDataUrl

  } catch (error) {
    console.error('❌ Erro no AnimeGAN:', error)
    throw error
  }
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}
