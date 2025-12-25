import { NextRequest, NextResponse } from 'next/server'

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

    // Validar formato da imagem (deve ser data URI)
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Formato de imagem inválido. Deve ser um data URI.' },
        { status: 400 }
      )
    }

    // Verificar se há token HF configurado (opcional)
    const hfToken = process.env.HUGGINGFACE_TOKEN

    if (!hfToken) {
      return NextResponse.json(
        {
          error: 'API do Hugging Face requer token. Use o filtro client-side ou configure HUGGINGFACE_TOKEN nas variáveis de ambiente.',
          useClientSide: true
        },
        { status: 400 }
      )
    }

    console.log('Iniciando processamento com Hugging Face...')

    // Converter data URI para Blob
    const base64Data = image.split(',')[1]
    const binaryData = Buffer.from(base64Data, 'base64')

    // Usar Hugging Face Inference API com autenticação
    const HF_API_URL = 'https://api-inference.huggingface.co/models/XpucT/Deliberate'

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: "anime style, manga illustration, beautiful anime art, vibrant colors, detailed, high quality, professional anime artwork, studio quality, masterpiece",
        parameters: {
          negative_prompt: "realistic, photographic, photo, 3d render, blurry, low quality, ugly, distorted, deformed, nsfw",
          num_inference_steps: 30,
          guidance_scale: 7.5,
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro da Hugging Face:', errorText)

      if (response.status === 503) {
        return NextResponse.json(
          { error: 'Modelo está inicializando. Tente novamente em 10-20 segundos.' },
          { status: 503 }
        )
      }

      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Token inválido. Verifique seu token do Hugging Face.', useClientSide: true },
          { status: 401 }
        )
      }

      throw new Error(`Erro ao processar: ${errorText}`)
    }

    const imageBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    const resultUrl = `data:image/png;base64,${base64Image}`

    console.log('Processamento concluído!')

    return NextResponse.json({ output: resultUrl })
  } catch (error: any) {
    console.error('Erro detalhado ao processar imagem:', error)

    let errorMessage = 'Erro ao processar imagem'

    if (error.message?.includes('rate limit')) {
      errorMessage = 'Muitas requisições. Aguarde alguns minutos e tente novamente.'
    } else if (error.message?.includes('loading')) {
      errorMessage = 'Modelo está carregando. Tente novamente em 10-20 segundos.'
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage, useClientSide: true },
      { status: 500 }
    )
  }
}
