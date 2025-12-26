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

  let model: tfc.GraphModel | null = null
  let imgTensor: tf.Tensor | null = null
  let scaledTensor: tf.Tensor | null = null
  let generated: tf.Tensor | null = null
  let outputTensor: tf.Tensor | null = null

  try {
    console.log('📊 Memória antes:', tf.memory())

    // 1. Carregar imagem
    if (onProgress) onProgress(0.1)
    console.log('1️⃣ Carregando imagem...')
    const img = await loadImage(imageDataUrl)
    console.log('✅ Imagem carregada:', img.width, 'x', img.height)

    // 2. Carregar modelo
    if (onProgress) onProgress(0.2)
    console.log('2️⃣ Carregando modelo AnimeGAN (~15MB)...')
    const modelUrl = '/models/animegan/model.json'

    try {
      model = await tfc.loadGraphModel(modelUrl)
      console.log('✅ Modelo carregado!')
      console.log('📊 Memória após carregar modelo:', tf.memory())
    } catch (modelError) {
      console.error('❌ Erro ao carregar modelo:', modelError)
      throw new Error('Falha ao carregar modelo AnimeGAN. Verifique se os arquivos estão no servidor.')
    }

    // 3. Processar imagem
    if (onProgress) onProgress(0.4)
    console.log('3️⃣ Convertendo imagem para tensor...')

    imgTensor = tf.browser.fromPixels(img)
    console.log('Tamanho original:', imgTensor.shape)

    // Redimensionar se necessário
    const [height, width] = imgTensor.shape
    const longSide = Math.max(height, width)

    if (longSide > maxSize) {
      const scaleFactor = longSide / maxSize
      const scaledSize = [
        Math.round(height / scaleFactor),
        Math.round(width / scaleFactor)
      ]
      console.log('Redimensionando para:', scaledSize)
      scaledTensor = tf.tidy(() =>
        tf.image.resizeBilinear(imgTensor!, scaledSize as [number, number])
          .expandDims(0)
          .div(255)
      )
    } else {
      scaledTensor = tf.tidy(() =>
        imgTensor!.expandDims(0).div(255)
      )
    }

    imgTensor.dispose()
    imgTensor = null
    console.log('✅ Tensor preparado:', scaledTensor.shape)
    console.log('📊 Memória após preparar tensor:', tf.memory())

    // 4. Executar modelo
    if (onProgress) onProgress(0.5)
    console.log('4️⃣ Executando AnimeGAN (pode levar 10-20s)...')
    const startTime = performance.now()

    try {
      generated = await model.executeAsync({'test': scaledTensor}) as tf.Tensor
      console.log('✅ Modelo executado! Shape:', generated.shape)
    } catch (execError) {
      console.error('❌ Erro ao executar modelo:', execError)
      throw new Error('Erro durante processamento com AnimeGAN: ' + execError)
    }

    const elapsed = ((performance.now() - startTime) / 1000).toFixed(1)
    console.log(`✨ Transformação concluída em ${elapsed}s!`)
    console.log('📊 Memória após execução:', tf.memory())

    scaledTensor.dispose()
    scaledTensor = null

    // 5. Converter resultado para imagem
    if (onProgress) onProgress(0.9)
    console.log('5️⃣ Convertendo resultado para imagem...')

    const canvas = document.createElement('canvas')
    outputTensor = tf.tidy(() =>
      generated!.squeeze([0]).add(1).div(2)
    ) as tf.Tensor3D

    console.log('Tensor de saída:', outputTensor.shape)
    await tf.browser.toPixels(outputTensor, canvas)
    console.log('✅ Canvas criado:', canvas.width, 'x', canvas.height)

    // 6. Retornar data URL
    if (onProgress) onProgress(1.0)
    const resultDataUrl = canvas.toDataURL('image/png', 0.95)

    console.log('✅ AnimeGAN: Transformação completa!')
    console.log('📊 Memória final:', tf.memory())

    return resultDataUrl

  } catch (error) {
    console.error('❌ ERRO CRÍTICO no AnimeGAN:', error)
    console.log('📊 Memória no erro:', tf.memory())
    throw error
  } finally {
    // Limpar TODOS os tensores e modelo
    console.log('🧹 Limpando memória...')
    if (generated) generated.dispose()
    if (outputTensor) outputTensor.dispose()
    if (scaledTensor) scaledTensor.dispose()
    if (imgTensor) imgTensor.dispose()
    if (model) model.dispose()

    // Forçar garbage collection
    tf.dispose()
    console.log('📊 Memória após limpeza:', tf.memory())
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
