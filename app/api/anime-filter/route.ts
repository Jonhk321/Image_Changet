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

    // Usar modelo Toonify para conversão estilo anime/cartoon
    // O modelo aceita data URIs diretamente
    const output = await replicate.run(
      "fofr/sdxl-toonify:8cb7f5d8287ad1c7b7b66ba361b358ff6aa94f5e25b9a840fef34d88c6f11df3",
      {
        input: {
          image: image, // Data URI completo
          prompt: "anime illustration style, beautiful, high quality, detailed",
          negative_prompt: "photo, photorealistic, 3d render, blurry, low quality, ugly",
          guidance_scale: 7.5,
          num_inference_steps: 30,
          strength: 0.8
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
