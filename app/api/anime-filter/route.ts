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

    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Formato de imagem inválido' },
        { status: 400 }
      )
    }

    const hfToken = process.env.HUGGINGFACE_TOKEN

    if (!hfToken) {
      return NextResponse.json(
        { error: 'Token do Hugging Face não configurado', useClientSide: true },
        { status: 400 }
      )
    }

    console.log('Processando com modelo anime profissional...')

    // Converter data URI para buffer
    const base64Data = image.split(',')[1]
    const imageBuffer = Buffer.from(base64Data, 'base64')

    // Usar modelo AnimeGAN para conversão profissional
    const HF_API_URL = 'https://api-inference.huggingface.co/models/cagliostrolab/animagine-xl-3.1'

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: imageBuffer.toString('base64'),
        parameters: {
          prompt: "anime illustration, professional digital art, vibrant colors, detailed anime style, high quality anime artwork, beautiful illustration, masterpiece",
          negative_prompt: "realistic, photo, photograph, 3d, blurry, low quality, watermark, text",
          num_inference_steps: 50,
          guidance_scale: 7.5,
          strength: 0.75,
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro HuggingFace:', errorText)

      if (response.status === 503) {
        return NextResponse.json(
          { error: 'Modelo carregando. Tente em 20 segundos.', useClientSide: true },
          { status: 503 }
        )
      }

      throw new Error(`Erro: ${response.status}`)
    }

    const resultBuffer = await response.arrayBuffer()
    const base64Result = Buffer.from(resultBuffer).toString('base64')
    const resultUrl = `data:image/png;base64,${base64Result}`

    console.log('Processamento concluído!')

    return NextResponse.json({ output: resultUrl })
  } catch (error: any) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar', useClientSide: true },
      { status: 500 }
    )
  }
}
