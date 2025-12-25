# Anime Filter App - Transforme Fotos em Arte Anime com IA

Uma aplicação web moderna que transforma suas fotos em ilustrações estilo anime usando modelos de Inteligência Artificial avançados.

## Funcionalidades

- Upload de imagens (JPG, PNG, WebP)
- Conversão real para estilo anime/ilustração usando IA
- Visualização lado a lado (original vs anime)
- Download da imagem transformada
- Interface responsiva e moderna
- Processamento via API Replicate com modelos de IA state-of-the-art

## Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Replicate API** - Modelos de IA para transformação em anime
- **Vercel** - Hospedagem e deployment

## Como Funciona

A aplicação usa modelos de IA especializados (via Replicate API) que:

1. Analisam sua foto usando redes neurais convolucionais
2. Identificam características faciais e estruturas
3. Aplicam estilo de ilustração anime/cartoon
4. Preservam a identidade mantendo o estilo artístico
5. Retornam uma imagem de alta qualidade no estilo desejado

## Pré-requisitos

Para usar esta aplicação, você precisa de uma conta Replicate:

1. Crie uma conta gratuita em [replicate.com](https://replicate.com)
2. Obtenha sua API token em [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
3. Replicate oferece créditos gratuitos para começar

## Instalação Local

```bash
# Clonar o repositório
git clone <seu-repositorio>

# Entrar no diretório
cd Image_Changet

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env e adicionar seu REPLICATE_API_TOKEN
# REPLICATE_API_TOKEN=r8_...
```

Edite o arquivo `.env` e adicione seu token da Replicate:

```
REPLICATE_API_TOKEN=r8_seu_token_aqui
```

```bash
# Executar em modo de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Deploy no Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Passos para Deploy:

1. Faça push do código para seu repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em "New Project" e importe seu repositório
4. **IMPORTANTE:** Antes de fazer deploy, adicione a variável de ambiente:
   - Vá em "Environment Variables"
   - Adicione: `REPLICATE_API_TOKEN` = `seu_token_aqui`
5. Clique em "Deploy"

O Vercel detectará automaticamente que é um projeto Next.js e configurará tudo.

### Adicionar API Token no Vercel:

1. No painel do seu projeto no Vercel
2. Vá em "Settings" > "Environment Variables"
3. Adicione:
   - **Name:** `REPLICATE_API_TOKEN`
   - **Value:** Seu token do Replicate
   - **Environment:** Production, Preview, Development
4. Faça redeploy se necessário

## Como Usar

1. **Carregar Foto** - Clique no botão e selecione uma foto sua
2. **Transformar** - Clique em "Transformar em Anime com IA"
3. **Aguarde** - O processamento pode levar 30-60 segundos
4. **Baixar** - Salve sua ilustração anime

## Estrutura do Projeto

```
├── app/
│   ├── api/
│   │   └── anime-filter/
│   │       └── route.ts       # API route para processar imagens
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Página inicial com UI
│   └── globals.css            # Estilos globais
├── next.config.js             # Configuração Next.js
├── tailwind.config.js         # Configuração Tailwind
├── .env.example               # Exemplo de variáveis de ambiente
└── package.json               # Dependências
```

## Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linter
```

## Modelos de IA Utilizados

A aplicação usa o modelo **SDXL Toonify** via Replicate, que é especializado em:
- Conversão de fotos realistas para estilo cartoon/anime
- Preservação de características faciais
- Alta qualidade de output
- Estilo consistente e artístico

## Custos

- **Replicate:** Oferece créditos gratuitos iniciais. Após isso, cobra por uso (consulte [replicate.com/pricing](https://replicate.com/pricing))
- **Vercel:** Tier gratuito generoso para projetos pessoais

## Problemas Comuns

### "API token não configurada"
- Verifique se adicionou `REPLICATE_API_TOKEN` no arquivo `.env` (local) ou nas variáveis de ambiente do Vercel (produção)

### "Erro ao processar imagem"
- Verifique se sua conta Replicate tem créditos disponíveis
- Tente com uma imagem menor (< 5MB)
- Verifique sua conexão com internet

### Tempo de processamento longo
- Modelos de IA podem levar 30-60 segundos
- Isso é normal e depende da fila de processamento da Replicate

## Licença

MIT

## Autor

Criado com Claude Code
