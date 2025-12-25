# Anime Filter App - 100% GRATUITO 🎉

Uma aplicação web moderna que transforma suas fotos em ilustrações estilo anime com **DUAS OPÇÕES**:
- ⚡ **Filtro instantâneo** (client-side, sem configuração)
- 🤖 **IA profissional AnimeGANv2** (Hugging Face, totalmente gratuito e sem configuração)

## ✨ Destaques

- 🆓 **100% GRATUITO** - Funciona sem configuração nenhuma!
- ⚡ **Instantâneo** - Filtro client-side processa em segundos
- 🤖 **IA Real** - AnimeGANv2 para transformação profissional (gratuito, sem token)
- 🚀 **Deploy Fácil** - Um clique no Vercel
- 📱 **Responsivo** - Funciona perfeitamente em mobile e desktop
- 🔒 **Privado** - Processamento local ou via API pública

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
- **AnimeGANv2** - IA especializada em transformação foto→anime
- **Hugging Face Spaces** - API pública gratuita
- **Vercel** - Hospedagem gratuita

## Como Funciona

A aplicação oferece **DUAS OPÇÕES**:

### Opção 1: Filtro Client-Side (Padrão)
- ⚡ **Instantâneo** - Processa em 1-2 segundos
- 🆓 **Sem configuração** - Funciona imediatamente
- 🎨 **Bom resultado** - Efeito anime/cartoon
- 📱 **Totalmente offline** - Processa no navegador

### Opção 2: IA AnimeGANv2 (Automático com Fallback Inteligente)
- 🤖 **Qualidade profissional** - AnimeGANv2 com 3 estilos diferentes
  - **Hayao**: Estilo Studio Ghibli (Hayao Miyazaki)
  - **Paprika**: Estilo colorido e vibrante
  - **Shinkai**: Estilo Makoto Shinkai (Your Name)
- 🆓 **Gratuito sem configuração** - API pública do Hugging Face
- ⏱️ **10-30 segundos** - Processamento via API
- 🎯 **Resultado autêntico** - Transformação real em anime
- 🔄 **Sistema de fallback** - Tenta automaticamente 3 endpoints diferentes

**Como funciona:** A aplicação tenta automaticamente os 3 modelos em ordem. Se um estiver ocupado, passa para o próximo instantaneamente. Só usa o filtro local se todos estiverem indisponíveis!

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

### Deploy (3 passos simples):

1. Faça push do código para seu repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em "New Project" e importe seu repositório
4. Clique em "Deploy"

**Pronto! Funciona com IA profissional instantaneamente!** ✨

Não precisa configurar tokens ou variáveis de ambiente. A IA AnimeGANv2 funciona através de API pública gratuita!

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

| Característica | Filtro Client-Side | IA AnimeGANv2 |
|---------------|-------------------|-----------------|
| **Velocidade** | ⚡ 1-2 segundos | ⏱️ 10-30 segundos |
| **Configuração** | ✅ Nenhuma | ✅ Nenhuma |
| **Qualidade** | 🎨 Boa | 🤖 Excelente |
| **Custo** | 🆓 Grátis | 🆓 Grátis |
| **Offline** | ✅ Funciona | ❌ Precisa internet |
| **Tipo** | Filtro de cores | Transformação real |
| **Melhor para** | Preview rápido | Resultado final |

**Recomendação:** A aplicação usa automaticamente a IA AnimeGANv2. Se a API estiver ocupada, cai para o filtro local!

## Estilos de Anime Disponíveis

A aplicação tenta automaticamente 3 estilos diferentes de AnimeGANv2:

### 🎨 Hayao (Studio Ghibli)
- Estilo inspirado em Hayao Miyazaki
- Cores suaves e pastéis
- Visual nostálgico e aquarelado
- Melhor para: Paisagens e retratos artísticos

### 🌸 Paprika
- Estilo vibrante e colorido
- Cores saturadas e vivas
- Visual moderno e energético
- Melhor para: Fotos com cores fortes

### ✨ Shinkai (Your Name)
- Estilo inspirado em Makoto Shinkai
- Iluminação dramática
- Visual cinematográfico
- Melhor para: Cenas com luz e sombra

**A aplicação tenta os 3 automaticamente** e usa o primeiro que estiver disponível!

## Problemas Comuns

### "APIs de IA indisponíveis"
- Todos os 3 modelos estão temporariamente ocupados
- A aplicação automaticamente usa o filtro local
- Tente novamente em alguns minutos
- O sistema de fallback garante que sempre funcione!

### Processamento lento
- Modelos de IA levam 10-30 segundos
- Se demorar muito, pode ser que o modelo esteja frio (primeira execução)
- O sistema tenta automaticamente outro modelo se um demorar demais

## Custos

### AnimeGANv2 (Hugging Face Spaces):
- **GRATUITO** ✨
- API pública sem limites
- Sem necessidade de cadastro ou autenticação
- Sem configuração de tokens

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
