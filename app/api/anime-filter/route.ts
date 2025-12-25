import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

// Lista de endpoints para tentar em ordem (fallback automático)
const ANIME_ENDPOINTS = [
  {
    name: 'AnimeGANv2 - Hayao',
    url: 'https://akhaliq-animeganv2.hf.space/api/predict',
    format: 'gradio',
  },
  {
    name: 'AnimeGANv2 - Paprika',
    url: 'https://huggingface.co/spaces/akhaliq/AnimeGANv2-Paprika/api/predict',
    format: 'gradio',
  },
  {
    name: 'AnimeGANv2 - Shinkai',
    url: 'https://huggingface.co/spaces/akhaliq/AnimeGANv2-Shinkai/api/predict',
    format: 'gradio',
  },
]

async function tryAnimeEndpoint(endpoint: typeof ANIME_ENDPOINTS[0], base64Data: string) {
  console.log(`Tentando ${endpoint.name}...`)

  const response = await fetch(endpoint.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: [`data:image/jpeg;base64,${base64Data}`]
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json()

  if (!result.data || !result.data[0]) {
    throw new Error('Resposta inválida')
  }

  return result.data[0]
}

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

    console.log('Iniciando transformação anime com fallback multi-endpoint...')

    // Converter data URI para buffer
    const base64Data = image.split(',')[1]

    // Tentar cada endpoint em ordem
    let lastError: Error | null = null

    for (const endpoint of ANIME_ENDPOINTS) {
      try {
        const resultUrl = await tryAnimeEndpoint(endpoint, base64Data)
        console.log(`✓ Sucesso com ${endpoint.name}!`)
        return NextResponse.json({ output: resultUrl })
      } catch (error: any) {
        console.log(`✗ ${endpoint.name} falhou: ${error.message}`)
        lastError = error
        // Continua para o próximo endpoint
      }
    }

    // Se chegou aqui, todos os endpoints falharam
    console.error('Todos os endpoints falharam, usando fallback client-side')
    return NextResponse.json(
      {
        error: `Todas as APIs estão indisponíveis no momento. Último erro: ${lastError?.message}`,
        useClientSide: true
      },
      { status: 503 }
    )
  } catch (error: any) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar', useClientSide: true },
      { status: 500 }
    )
  }
}
