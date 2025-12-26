import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

// DeepAI Toonify API - Tier gratuito disponível
const DEEPAI_API_URL = 'https://api.deepai.org/api/toonify'
const DEEPAI_API_KEY = process.env.DEEPAI_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Nenhuma imagem fornecida' },
        { status: 400 }
      )
    }

    console.log('🎨 Processando com DeepAI Toonify...')

    // Verificar se tem API key
    if (!DEEPAI_API_KEY) {
      console.warn('⚠️ DEEPAI_API_KEY não configurada, tentando sem autenticação...')
    }

    // Converter base64 para FormData
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Criar FormData
    const formData = new FormData()
    const blob = new Blob([buffer], { type: 'image/jpeg' })
    formData.append('image', blob, 'image.jpg')

    // Fazer requisição para DeepAI
    const response = await fetch(DEEPAI_API_URL, {
      method: 'POST',
      headers: DEEPAI_API_KEY ? { 'api-key': DEEPAI_API_KEY } : {},
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro DeepAI:', response.status, errorText)

      // Se falhar, retornar erro para usar fallback client-side
      return NextResponse.json(
        {
          error: `DeepAI falhou: ${response.status}`,
          details: errorText,
          useClientSide: true
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('✅ DeepAI processou com sucesso!')

    // DeepAI retorna URL da imagem processada
    if (result.output_url) {
      // Baixar a imagem processada e converter para base64
      const imageResponse = await fetch(result.output_url)
      const imageBuffer = await imageResponse.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString('base64')
      const outputDataUrl = `data:image/png;base64,${base64Image}`

      return NextResponse.json({
        output: outputDataUrl,
        method: 'DeepAI Toonify'
      })
    } else {
      throw new Error('DeepAI não retornou output_url')
    }

  } catch (error: any) {
    console.error('❌ Erro no processamento:', error)
    return NextResponse.json(
      {
        error: error.message || 'Erro desconhecido',
        useClientSide: true
      },
      { status: 500 }
    )
  }
}
