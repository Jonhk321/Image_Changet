# Anime Filter App

Uma aplicação web moderna que transforma suas fotos em arte estilo anime usando filtros avançados de processamento de imagem.

## Funcionalidades

- Upload de imagens (JPG, PNG, WebP)
- Filtro de anime em tempo real processado no navegador
- Controle de intensidade do filtro
- Visualização lado a lado (original vs filtrada)
- Download da imagem processada
- Interface responsiva e moderna
- 100% client-side (nenhum dado é enviado para servidores)

## Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Canvas API** - Processamento de imagem
- **Vercel** - Hospedagem e deployment

## Como o Filtro Anime Funciona

O filtro aplica várias técnicas de processamento de imagem:

1. **Posterização** - Reduz a paleta de cores para criar um efeito cartoon
2. **Ajuste de Saturação** - Aumenta a vivacidade das cores
3. **Aumento de Contraste** - Destaca áreas claras e escuras
4. **Detecção de Bordas (Sobel)** - Cria contornos escuros ao redor de objetos
5. **Suavização de Pele** - Detecta e suaviza tons de pele
6. **Ajuste de Brilho** - Ilumina a imagem para um visual mais vibrante

## Instalação Local

```bash
# Clonar o repositório
git clone <seu-repositorio>

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Deploy no Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Passos para Deploy:

1. Faça push do código para seu repositório GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe seu repositório
4. Clique em "Deploy"

O Vercel detectará automaticamente que é um projeto Next.js e configurará tudo.

## Como Usar

1. **Carregar Foto** - Clique no botão e selecione uma imagem
2. **Ajustar Intensidade** - Use o slider para controlar o efeito
3. **Aplicar Filtro** - Clique em "Aplicar Filtro Anime"
4. **Baixar** - Salve sua imagem transformada

## Estrutura do Projeto

```
├── app/
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página inicial com UI
│   └── globals.css     # Estilos globais
├── lib/
│   └── animeFilter.ts  # Lógica do filtro de anime
├── next.config.js      # Configuração Next.js
├── tailwind.config.js  # Configuração Tailwind
└── package.json        # Dependências
```

## Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linter
```

## Privacidade

Todo o processamento de imagem acontece localmente no seu navegador. Nenhuma imagem é enviada para servidores externos.

## Licença

MIT

## Autor

Criado com Claude Code
