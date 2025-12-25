# 🚀 Guia Rápido de Deploy no Vercel

## Passo 1: Criar conta Replicate (GRATUITA)

1. Acesse: https://replicate.com
2. Clique em "Sign Up" (pode usar sua conta GitHub)
3. Vá em: https://replicate.com/account/api-tokens
4. Clique em "Create Token"
5. Copie o token que começa com `r8_...`

**Você recebe créditos gratuitos para começar!**

---

## Passo 2: Deploy no Vercel (3 cliques)

### Opção A: Via GitHub (RECOMENDADO - Mais fácil)

1. **Acesse:** https://vercel.com
2. **Login com GitHub**
3. **Clique em:** "Add New Project"
4. **Selecione:** `Jonhk321/Image_Changet`
5. **IMPORTANTE - Antes de clicar em Deploy:**
   - Expanda "Environment Variables"
   - Adicione:
     - **Name:** `REPLICATE_API_TOKEN`
     - **Value:** Cole o token do Replicate (r8_...)
     - Marque: Production, Preview, Development
6. **Clique em:** "Deploy"

✅ **Pronto! Em 2-3 minutos seu site estará no ar!**

---

### Opção B: Via Vercel CLI (Alternativa)

Se preferir usar a linha de comando:

```bash
# 1. Fazer login no Vercel
vercel login

# 2. Deploy do projeto
vercel

# 3. Adicionar variável de ambiente
vercel env add REPLICATE_API_TOKEN
# Cole seu token quando solicitado
# Selecione: Production, Preview, Development

# 4. Redeploy para aplicar as variáveis
vercel --prod
```

---

## Passo 3: Testar

1. Vercel mostrará a URL do seu site (algo como: `image-changet.vercel.app`)
2. Abra a URL
3. Faça upload de uma foto
4. Clique em "Transformar em Anime com IA"
5. Aguarde 30-60 segundos
6. Baixe sua arte anime!

---

## ⚠️ Importante

### Se aparecer erro "API token não configurada":

1. Vá no painel do Vercel
2. Clique no projeto
3. Vá em "Settings" > "Environment Variables"
4. Verifique se `REPLICATE_API_TOKEN` está lá
5. Se não estiver, adicione e faça redeploy

### Se aparecer erro "Insufficient credits":

- Sua conta Replicate ficou sem créditos
- Adicione créditos em: https://replicate.com/pricing
- Ou espere o próximo mês (se tiver plano gratuito)

---

## 📊 Custos Estimados

### Replicate:
- **Créditos gratuitos:** Suficiente para testar
- **Após créditos:** ~$0.02-0.05 por imagem
- Veja preços atualizados: https://replicate.com/pricing

### Vercel:
- **Hobby Plan:** GRATUITO
- Inclui: 100GB bandwidth, builds ilimitados
- Perfeito para projetos pessoais

---

## 🎉 URL de Deploy Rápido

Clique aqui para deploy automático (você só precisará adicionar a variável de ambiente):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJonhk321%2FImage_Changet&env=REPLICATE_API_TOKEN&envDescription=Token%20da%20API%20Replicate%20para%20processar%20imagens&envLink=https%3A%2F%2Freplicate.com%2Faccount%2Fapi-tokens)

---

## 📞 Suporte

Se tiver qualquer problema:
1. Verifique se a variável `REPLICATE_API_TOKEN` está configurada
2. Verifique se sua conta Replicate tem créditos
3. Veja os logs de erro no painel do Vercel em "Deployments" > "Functions"
