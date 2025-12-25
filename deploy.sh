#!/bin/bash

# Script de Deploy Automatizado para Vercel
# Execute este script localmente na sua máquina

echo "🚀 Deploy Automatizado - Anime Filter App"
echo "=========================================="
echo ""

# Verificar se está logado no Vercel
echo "📝 Verificando login no Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "❌ Você não está logado no Vercel CLI"
    echo "Execute: vercel login"
    exit 1
fi

echo "✅ Logado no Vercel!"
echo ""

# Pedir token do Replicate
echo "🔑 Token do Replicate"
echo "--------------------"
echo "Obtenha seu token em: https://replicate.com/account/api-tokens"
echo ""
read -p "Cole seu token do Replicate aqui: " REPLICATE_TOKEN

if [ -z "$REPLICATE_TOKEN" ]; then
    echo "❌ Token não fornecido!"
    exit 1
fi

echo ""
echo "📦 Iniciando deploy..."
echo ""

# Fazer deploy
vercel --prod --yes

echo ""
echo "🔧 Configurando variável de ambiente..."
echo ""

# Adicionar variável de ambiente
echo "$REPLICATE_TOKEN" | vercel env add REPLICATE_API_TOKEN production

echo ""
echo "🔄 Fazendo redeploy com a variável configurada..."
echo ""

# Redeploy para aplicar a variável
vercel --prod --yes

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🎉 Seu site está no ar!"
echo "Acesse o painel do Vercel para ver a URL: https://vercel.com/dashboard"
echo ""
