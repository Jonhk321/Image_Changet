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

    const replicate = new Replicate({
      auth: apiToken,
    })

    // Usar modelo Toonify para conversão estilo anime/cartoon
    const output = await replicate.run(
      "fofr/sdxl-toonify:8cb7f5d8287ad1c7b7b66ba361b358ff6aa94f5e25b9a840fef34d88c6f11df3",
      {
        input: {
          image: image,
          prompt: "anime illustration style, high quality, detailed",
          negative_prompt: "photo, photorealistic, 3d render, blurry, low quality",
          guidance_scale: 7.5,
          num_inference_steps: 30
        }
      }
    ) as any

    const resultUrl = Array.isArray(output) ? output[0] : output

    return NextResponse.json({ output: resultUrl })
  } catch (error: any) {
    console.error('Erro ao processar imagem:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar imagem' },
      { status: 500 }
    )
  }
}
