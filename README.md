# Anime Filter App - 100% GRATUITO 🎉

Uma aplicação web moderna que transforma suas fotos em ilustrações estilo anime usando IA **TOTALMENTE GRATUITA!**

## ✨ Destaques

- 🆓 **100% GRATUITO** - Sem custos, sem créditos, sem limites de pagamento
- 🤖 **IA Real** - Usa Hugging Face Inference API
- 🎨 **Qualidade Profissional** - Modelos de anime de alta qualidade
- 🚀 **Deploy Fácil** - Um clique no Vercel
- 📱 **Responsivo** - Funciona perfeitamente em mobile e desktop
- 🔒 **Privado** - Processamento via API pública da Hugging Face

## Funcionalidades

- Upload de imagens (JPG, PNG, WebP)
- Conversão real para estilo anime/ilustração usando IA
- Redimensionamento automático e otimização
- Visualização lado a lado (original vs anime)
- Download da imagem transformada
- Interface responsiva e moderna
- **SEM custos ou limites de crédito!**

## Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Hugging Face Inference API** - IA gratuita para transformação em anime
- **Vercel** - Hospedagem gratuita

## Como Funciona

A aplicação usa a **Hugging Face Inference API** que é **100% GRATUITA**:

1. Você faz upload de uma foto
2. Imagem é automaticamente redimensionada e otimizada
3. Enviada para modelos de IA especializados em anime (gratuitos)
4. IA transforma em estilo anime/manga profissional
5. Você baixa o resultado em alta qualidade

**Sem cadastro, sem créditos, sem pagamentos!**

## Instalação Local

```bash
# Clonar o repositório
git clone <seu-repositorio>

# Entrar no diretório
cd Image_Changet

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Deploy no Vercel (GRATUITO)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Passos para Deploy:

1. Faça push do código para seu repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em "New Project" e importe seu repositório
4. Clique em "Deploy"

**Pronto! Não precisa configurar nada!** ✨

O Vercel detectará automaticamente que é um projeto Next.js e configurará tudo.

**Não precisa de variáveis de ambiente ou API keys!**

## Como Usar

1. **Carregar Foto** - Clique no botão e selecione uma foto sua
2. **Transformar** - Clique em "Transformar em Anime com IA"
3. **Aguarde** - O processamento pode levar 20-60 segundos
4. **Baixar** - Salve sua ilustração anime

## Estrutura do Projeto

```
├── app/
│   ├── api/
│   │   └── anime-filter/
│   │       └── route.ts       # API route com Hugging Face
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Página inicial com UI
│   └── globals.css            # Estilos globais
├── next.config.js             # Configuração Next.js
├── tailwind.config.js         # Configuração Tailwind
└── package.json               # Dependências
```

## Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linter
```

## Sobre a API Gratuita

### Hugging Face Inference API

- ✅ **Completamente gratuita**
- ✅ **Sem limites de crédito**
- ✅ **Modelos de alta qualidade**
- ✅ **Não requer autenticação**
- ⚠️ Pode ter rate limits (mas muito generosos)
- ⚠️ Modelo pode levar 10-20s para inicializar se inativo

### Limitações:

- Primeira requisição pode ser lenta (modelo carregando)
- Rate limits em uso muito intenso (raramente atingido)
- Processamento pode levar 30-60 segundos

**Mas é 100% gratuito para sempre!** 🎉

## Problemas Comuns

### "Modelo está inicializando"
- O modelo estava inativo e está sendo carregado
- Aguarde 10-20 segundos e tente novamente
- Isso só acontece na primeira vez

### "Muitas requisições"
- Rate limit temporário foi atingido
- Aguarde alguns minutos
- Isso é raro em uso normal

### Processamento lento
- Modelos de IA levam tempo
- 30-60 segundos é normal
- A qualidade compensa a espera!

## Custos

### Hugging Face:
- **GRATUITO** ✨
- Sem limites de crédito
- Sem necessidade de cadastro ou autenticação

### Vercel:
- **GRATUITO** (plano Hobby)
- Inclui domínio `.vercel.app` grátis
- Deploy automático a cada push

**Total: R$ 0,00 para sempre!** 🚀

## Licença

MIT

## Autor

Criado com Claude Code

---

## 🎯 Deploy Rápido

**Clique aqui e em 2 minutos está no ar:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jonhk321/Image_Changet)

**100% GRATUITO - Sem pegadinhas!** ✨
