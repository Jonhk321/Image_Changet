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

    console.log('Processando com AnimeGANv2 (modelo gratuito)...')

    // Converter data URI para buffer
    const base64Data = image.split(',')[1]

    // Usar API do Hugging Face Spaces com modelo anime dedicado
    // AnimeGANv2 é específico para transformação foto->anime
    const HF_SPACE_API = 'https://akhaliq-animeganv2.hf.space/api/predict'

    const response = await fetch(HF_SPACE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [`data:image/jpeg;base64,${base64Data}`]
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro HuggingFace Space:', errorText)

      if (response.status === 503) {
        return NextResponse.json(
          { error: 'Modelo carregando. Tente em 20 segundos.', useClientSide: true },
          { status: 503 }
        )
      }

      throw new Error(`Erro: ${response.status}`)
    }

    const result = await response.json()

    // Gradio retorna { data: [imageDataUrl] }
    if (!result.data || !result.data[0]) {
      throw new Error('Resposta inválida do modelo')
    }

    const resultUrl = result.data[0]

    console.log('Processamento concluído com AnimeGANv2!')

    return NextResponse.json({ output: resultUrl })
  } catch (error: any) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar', useClientSide: true },
      { status: 500 }
    )
  }
}
