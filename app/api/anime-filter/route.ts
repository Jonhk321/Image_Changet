import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      )
    }

    const apiToken = process.env.REPLICATE_API_TOKEN

    if (!apiToken) {
      return NextResponse.json(
        { error: 'API token não configurada. Configure REPLICATE_API_TOKEN no arquivo .env.local' },
        { status: 500 }
      )
    }

    // Validar formato da imagem (deve ser data URI)
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Formato de imagem inválido. Deve ser um data URI.' },
        { status: 400 }
      )
    }

    const replicate = new Replicate({
      auth: apiToken,
    })

    console.log('Iniciando processamento com Replicate...')

    // Usar SDXL com img2img para conversão em anime
    // Este modelo é público e amplamente usado
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          image: image,
          prompt: "anime style, manga illustration, beautiful anime art, vibrant colors, detailed, high quality, professional anime artwork, studio quality",
          negative_prompt: "realistic, photographic, photo, 3d render, blurry, low quality, ugly, distorted, deformed, nsfw",
          num_outputs: 1,
          num_inference_steps: 25,
          guidance_scale: 7.5,
          prompt_strength: 0.8,
          refine: "expert_ensemble_refiner",
          scheduler: "K_EULER"
        }
      }
    ) as any

    console.log('Processamento concluído!')

    // O output pode ser um array de URLs ou uma única URL
    const resultUrl = Array.isArray(output) ? output[0] : output

    if (!resultUrl) {
      throw new Error('Nenhuma imagem foi gerada pelo modelo')
    }

    return NextResponse.json({ output: resultUrl })
  } catch (error: any) {
    console.error('Erro detalhado ao processar imagem:', error)

    // Mensagens de erro mais específicas
    let errorMessage = 'Erro ao processar imagem'

    if (error.message?.includes('authentication')) {
      errorMessage = 'Erro de autenticação. Verifique se o token do Replicate está correto.'
    } else if (error.message?.includes('credits')) {
      errorMessage = 'Créditos insuficientes na conta Replicate. Adicione créditos em replicate.com'
    } else if (error.message?.includes('pattern')) {
      errorMessage = 'Formato de imagem inválido. Tente com outra imagem ou formato diferente.'
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
