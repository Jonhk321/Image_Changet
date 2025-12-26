import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

// Lista EXTENDIDA de endpoints para tentar em ordem (fallback automático)
// Quanto mais endpoints, maior a chance de um estar disponível!
const ANIME_ENDPOINTS = [
  // AnimeGANv2 - Variações oficiais
  {
    name: 'AnimeGANv2 - Hayao (Ghibli)',
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
  // URLs alternativas com domínios diferentes
  {
    name: 'AnimeGANv2 - Hayao (Mirror)',
    url: 'https://akhaliq-animeganv2.hf.space/run/predict',
    format: 'gradio',
  },
  {
    name: 'AnimeGANv2 - Face Paint v2',
    url: 'https://huggingface.co/spaces/akhaliq/AnimeGANv2-FacePaint_v2/api/predict',
    format: 'gradio',
  },
  // Tentativas com endpoints públicos conhecidos
  {
    name: 'Anime Style Transfer',
    url: 'https://hf.space/embed/TonyAssi/AnimeGANv2/api/predict',
    format: 'gradio',
  },
  {
    name: 'Cartoonify AI',
    url: 'https://huggingface.co/spaces/Gradio-Blocks/Cartoonify/api/predict',
    format: 'gradio',
  },
]

async function tryAnimeEndpoint(endpoint: typeof ANIME_ENDPOINTS[0], base64Data: string) {
  console.log(`\n🔄 Tentando ${endpoint.name}...`)
  console.log(`   URL: ${endpoint.url}`)

  // Timeout de 25 segundos por endpoint
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 25000)

  try {
    const startTime = Date.now()

    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [`data:image/jpeg;base64,${base64Data}`]
      }),
      signal: controller.signal,
    })

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    clearTimeout(timeoutId)

    console.log(`   ⏱️  Resposta em ${elapsed}s - Status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`   ❌ Erro HTTP ${response.status}: ${errorText.substring(0, 200)}`)
      throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`)
    }

    const result = await response.json()
    console.log(`   📦 Resultado recebido:`, result ? 'OK' : 'VAZIO')

    if (!result.data || !result.data[0]) {
      console.log(`   ❌ Formato inválido:`, JSON.stringify(result).substring(0, 200))
      throw new Error('Resposta inválida - sem data')
    }

    console.log(`   ✅ SUCESSO com ${endpoint.name}!`)
    return result.data[0]
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      console.log(`   ⏰ Timeout após 25s`)
      throw new Error('Timeout (25s)')
    }
    console.log(`   ❌ Erro:`, error.message)
    throw error
  }
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

    console.log('\n═══════════════════════════════════════════')
    console.log('🎨 Iniciando transformação anime')
    console.log('═══════════════════════════════════════════')

    // Converter data URI para buffer
    const base64Data = image.split(',')[1]
    const imageBuffer = Buffer.from(base64Data, 'base64')

    console.log(`📊 Tamanho da imagem: ${(imageBuffer.length / 1024).toFixed(1)} KB`)

    const hfToken = process.env.HUGGINGFACE_TOKEN

    // PRIMEIRA TENTATIVA: API oficial do HuggingFace (se token disponível)
    if (hfToken) {
      console.log('\n🔑 Token HF encontrado! Tentando API oficial primeiro...')

      const officialAPIs = [
        'https://api-inference.huggingface.co/models/TachibanaYoshino/AnimeGANv2',
        'https://api-inference.huggingface.co/models/akhaliq/AnimeGANv2',
      ]

      for (const apiUrl of officialAPIs) {
        try {
          console.log(`\n🔄 Tentando ${apiUrl}...`)
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hfToken}`,
            },
            body: imageBuffer,
          })

          if (response.ok) {
            const resultBlob = await response.arrayBuffer()
            const base64Result = Buffer.from(resultBlob).toString('base64')
            const resultUrl = `data:image/png;base64,${base64Result}`
            console.log(`✅ SUCESSO com API oficial!`)
            return NextResponse.json({ output: resultUrl })
          } else {
            const errorText = await response.text()
            console.log(`❌ API oficial falhou (${response.status}): ${errorText.substring(0, 100)}`)
          }
        } catch (error: any) {
          console.log(`❌ Erro na API oficial: ${error.message}`)
        }
      }
    }

    // SEGUNDA TENTATIVA: Espaços públicos do Gradio
    console.log('\n🌐 Tentando espaços públicos do HuggingFace...')
    let lastError: Error | null = null
    let attemptCount = 0

    for (const endpoint of ANIME_ENDPOINTS) {
      attemptCount++
      try {
        const resultUrl = await tryAnimeEndpoint(endpoint, base64Data)
        console.log(`\n✅ ═══ SUCESSO! ═══`)
        console.log(`   Endpoint vencedor: ${endpoint.name}`)
        console.log(`   Tentativas necessárias: ${attemptCount}/${ANIME_ENDPOINTS.length}`)
        return NextResponse.json({ output: resultUrl })
      } catch (error: any) {
        lastError = error
        // Continua para o próximo endpoint
      }
    }

    // Se chegou aqui, todos os endpoints falharam
    console.log('\n❌ ═══════════════════════════════════════════')
    console.log('❌ TODAS AS APIs FALHARAM!')
    console.log(`❌ Total de tentativas: ${hfToken ? attemptCount + 2 : attemptCount}`)
    console.log(`❌ Último erro: ${lastError?.message}`)
    console.log('❌ ═══════════════════════════════════════════')
    console.log('⚠️  Usando fallback client-side...\n')

    return NextResponse.json(
      {
        error: `Todas as ${attemptCount + (hfToken ? 2 : 0)} APIs tentadas estão indisponíveis. Último erro: ${lastError?.message}`,
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
