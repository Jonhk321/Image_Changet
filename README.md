# Anime Filter App - 100% GRATUITO 🎉

Uma aplicação web moderna que transforma suas fotos em ilustrações estilo anime com **DUAS OPÇÕES**:
- ⚡ **Filtro instantâneo** (client-side, sem configuração)
- 🤖 **IA profissional** (Hugging Face, token gratuito opcional)

## ✨ Destaques

- 🆓 **100% GRATUITO** - Funciona sem configuração nenhuma!
- ⚡ **Instantâneo** - Filtro client-side processa em segundos
- 🤖 **IA Opcional** - Use Hugging Face para qualidade superior (gratuito)
- 🚀 **Deploy Fácil** - Um clique no Vercel
- 📱 **Responsivo** - Funciona perfeitamente em mobile e desktop
- 🔒 **Privado** - Processamento local ou via API

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

A aplicação oferece **DUAS OPÇÕES**:

### Opção 1: Filtro Client-Side (Padrão)
- ⚡ **Instantâneo** - Processa em 1-2 segundos
- 🆓 **Sem configuração** - Funciona imediatamente
- 🎨 **Bom resultado** - Efeito anime/cartoon
- 📱 **Totalmente offline** - Processa no navegador

### Opção 2: IA do Hugging Face (Opcional)
- 🤖 **Qualidade superior** - IA profissional
- 🆓 **Gratuito** - Token gratuito do Hugging Face
- ⏱️ **30-60 segundos** - Processamento via API
- 🎯 **Resultado realista** - Estilo anime autêntico

**A aplicação escolhe automaticamente:** Se não houver token configurado, usa o filtro instantâneo!

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

### Deploy Básico (Filtro Instantâneo):

1. Faça push do código para seu repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em "New Project" e importe seu repositório
4. Clique em "Deploy"

**Pronto! Funciona instantaneamente!** ✨

### Deploy Avançado (Com IA do Hugging Face):

Se quiser qualidade superior com IA:

1. Crie conta em [huggingface.co](https://huggingface.co) (grátis)
2. Gere token em: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
3. No Vercel, adicione variável de ambiente:
   - **Name:** `HUGGINGFACE_TOKEN`
   - **Value:** Seu token
4. Redeploy

**Ambas opções são 100% gratuitas!**

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

## Comparação: Filtro vs IA

| Característica | Filtro Client-Side | IA Hugging Face |
|---------------|-------------------|-----------------|
| **Velocidade** | ⚡ 1-2 segundos | ⏱️ 30-60 segundos |
| **Configuração** | ✅ Nenhuma | 📝 Token gratuito |
| **Qualidade** | 🎨 Boa | 🤖 Excelente |
| **Custo** | 🆓 Grátis | 🆓 Grátis |
| **Offline** | ✅ Funciona | ❌ Precisa internet |
| **Melhor para** | Testes rápidos | Resultado final |

**Recomendação:** Comece com o filtro instantâneo, depois adicione o token para IA se quiser qualidade superior!

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
