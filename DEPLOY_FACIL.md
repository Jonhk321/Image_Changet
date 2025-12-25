# 🎯 Deploy Rápido no Vercel (Método Mais Fácil)

Você já está logado no Vercel e Replicate! Aqui está o método **MAIS RÁPIDO** para fazer o deploy:

---

## ⚡ Opção 1: Via Interface Web (RECOMENDADO - 2 minutos)

### Passo 1: Pegar seu Token do Replicate

Abra este link e copie o token:
**👉 https://replicate.com/account/api-tokens**

(Se não tiver token, clique em "Create Token")

### Passo 2: Deploy no Vercel

Clique aqui para importar automaticamente:
**👉 https://vercel.com/new/import?s=https%3A%2F%2Fgithub.com%2FJonhk321%2FImage_Changet**

Ou manualmente:
1. Acesse: **https://vercel.com/new**
2. Clique em "Import Git Repository"
3. Se não aparecer `Jonhk321/Image_Changet`:
   - Clique em "Adjust GitHub App Permissions"
   - Dê acesso ao repositório
   - Volte e selecione `Jonhk321/Image_Changet`

### Passo 3: Configurar Variável de Ambiente

**ANTES** de clicar em "Deploy":

1. Expanda "Environment Variables"
2. Adicione:
   - **Name:** `REPLICATE_API_TOKEN`
   - **Value:** Cole o token que você copiou
   - **Environments:** Marque todas (Production, Preview, Development)
3. Clique em "Deploy"

### Passo 4: Aguarde (2-3 minutos)

O Vercel vai:
- ✅ Instalar dependências
- ✅ Fazer build do projeto
- ✅ Fazer deploy
- ✅ Mostrar a URL do seu site

**Pronto! Seu site estará no ar! 🎉**

---

## ⚡ Opção 2: Via Script Automatizado (se preferir CLI)

Se preferir usar a linha de comando na sua máquina:

```bash
# 1. Certifique-se de estar no diretório do projeto
cd /caminho/para/Image_Changet

# 2. Execute o script de deploy
./deploy.sh
```

O script vai:
1. Verificar se você está logado no Vercel
2. Pedir seu token do Replicate
3. Fazer deploy automático
4. Configurar a variável de ambiente
5. Fazer redeploy

---

## ⚡ Opção 3: Deploy Manual via CLI

```bash
# 1. Login no Vercel (se ainda não fez)
vercel login

# 2. Deploy inicial
vercel --prod

# 3. Adicionar token do Replicate
vercel env add REPLICATE_API_TOKEN production
# Cole seu token quando solicitado

# 4. Redeploy para aplicar a variável
vercel --prod
```

---

## 📊 Depois do Deploy

### Ver seu site:
1. Acesse: https://vercel.com/dashboard
2. Clique no projeto `image-changet`
3. Copie a URL (será algo como: `image-changet-xxx.vercel.app`)

### Testar:
1. Abra a URL do seu site
2. Faça upload de uma foto sua
3. Clique em "Transformar em Anime com IA"
4. Aguarde 30-60 segundos
5. Baixe sua arte anime!

---

## ⚠️ Solução de Problemas

### Se aparecer "API token não configurada":
1. Vá em: https://vercel.com/dashboard
2. Clique no projeto
3. Settings > Environment Variables
4. Verifique se `REPLICATE_API_TOKEN` está lá
5. Se não, adicione e clique em "Redeploy"

### Se aparecer erro de build:
- Verifique os logs em: Deployments > [último deploy] > Logs
- O build deve funcionar (já testamos!)

---

## 💰 Custos

- **Vercel:** GRÁTIS (plano Hobby)
- **Replicate:** Você tem créditos gratuitos, depois ~$0.02-0.05 por imagem

---

## 🎯 Link Direto para Deploy Rápido

**Clique aqui e em 2 minutos está no ar:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jonhk321/Image_Changet&env=REPLICATE_API_TOKEN&envDescription=Cole%20seu%20token%20do%20Replicate&envLink=https://replicate.com/account/api-tokens)

Esse botão vai:
- ✅ Importar o repositório automaticamente
- ✅ Pedir o token do Replicate
- ✅ Fazer deploy completo
- ✅ Configurar tudo

**Mais fácil impossível! 🚀**
